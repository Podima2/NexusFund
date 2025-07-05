// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title USDC Crowdfunding Escrow on Base Sepolia
/// @notice Launch campaigns, accept USDC pledges across chains via Nexus, and handle release/refund logic
contract Nexusfund is ReentrancyGuard {
    IERC20 public immutable usdc;   // USDC token interface
    address public immutable admin; // Admin (can be same as deployer or a DAO)

    struct Campaign {
        address creator;
        uint256 goal;
        uint256 pledged;
        uint256 deadline;
        bool released;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // Events
    event CampaignCreated(uint256 indexed id, address indexed creator, uint256 goal, uint256 deadline);
    event Pledged(uint256 indexed id, address indexed from, uint256 amount);
    event Released(uint256 indexed id, uint256 total);
    event Refunded(uint256 indexed id, address indexed to, uint256 amount);

    /// @param _usdcAddr USDC token address on Base Sepolia
    /// @param _admin Admin address to manage campaigns
    constructor(address _usdcAddr, address _admin) {
        usdc = IERC20(_usdcAddr);
        admin = _admin;
        campaignCount = 0;
    }

    /// @notice Create a new crowdfunding campaign
    /// @param goal Amount of USDC to raise (6 decimals)
    /// @param durationSeconds Length of campaign from now, in seconds
    function createCampaign(uint256 goal, uint256 durationSeconds) external {
        require(goal > 0, "Goal > 0");
        require(durationSeconds > 0, "Duration > 0");

        uint256 id = campaignCount++;
        campaigns[id] = Campaign({
            creator: msg.sender,
            goal: goal,
            pledged: 0,
            deadline: block.timestamp + durationSeconds,
            released: false
        });

        emit CampaignCreated(id, msg.sender, goal, campaigns[id].deadline);
    }

    /// @notice Pledge USDC to a campaign
    /// @param id ID of campaign to contribute to
    /// @param amount USDC amount (must be pre-approved)
    function deposit(uint256 id, uint256 amount) external nonReentrant {
        Campaign storage c = campaigns[id];
        require(block.timestamp <= c.deadline, "Campaign ended");
        require(!c.released, "Already finalized");
        require(amount > 0, "Amount > 0");

        // Transfer USDC from pledger to contract
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        contributions[id][msg.sender] += amount;
        c.pledged += amount;
        emit Pledged(id, msg.sender, amount);
    }

    /// @notice Release funds to creator once goal is reached
    /// @param id Campaign ID
    function release(uint256 id) external nonReentrant {
        Campaign storage c = campaigns[id];
        require(msg.sender == c.creator || msg.sender == admin, "Not authorized");
        require(block.timestamp > c.deadline, "Campaign ongoing");
        require(c.pledged >= c.goal, "Goal not met");
        require(!c.released, "Already released");

        c.released = true;
        uint256 total = c.pledged;
        require(usdc.transfer(c.creator, total), "USDC transfer failed");

        emit Released(id, total);
    }

    /// @notice Refund contributor if goal not met
    /// @param id Campaign ID
    function refund(uint256 id) external nonReentrant {
        Campaign storage c = campaigns[id];
        require(block.timestamp > c.deadline, "Campaign ongoing");
        require(c.pledged < c.goal, "Goal reached");

        uint256 bal = contributions[id][msg.sender];
        require(bal > 0, "No contributions");

        contributions[id][msg.sender] = 0;
        require(usdc.transfer(msg.sender, bal), "Refund failed");

        emit Refunded(id, msg.sender, bal);
    }
}
