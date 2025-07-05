// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title USDC Crowdfunding Escrow with Rich Metadata on Base Sepolia
/// @notice Supports multiple campaigns with descriptive fields and cross-chain pledges via Nexus
contract USDC_Crowdfund is ReentrancyGuard {
    IERC20 public immutable usdc;   // USDC token interface (6 decimals)
    address public immutable admin; // Admin address (deployer/DAO)
    uint256[] public campaignIds;
    
    struct Campaign {
        address creator;     // Campaign owner
        uint256 goal;        // Target USDC amount
        uint256 pledged;     // Current pledged amount
        uint256 deadline;    // UNIX timestamp deadline
        bool released;       // Whether funds have been released
        string title;        // Campaign title
        string description;  // Detailed description
        string category;     // Category (e.g. "Art", "Tech")
        string imageUrl;     // URL for campaign image
        string[] tags;       // Tags for search & categorization
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // Events
    event CampaignCreated(uint256 indexed id, address indexed creator);
    event Pledged(uint256 indexed id, address indexed from, uint256 amount);
    event Released(uint256 indexed id, uint256 total);
    event Refunded(uint256 indexed id, address indexed to, uint256 amount);

    /// @param _usdcAddr USDC token address on Base Sepolia
    /// @param _admin Admin address allowed to release funds
    constructor(address _usdcAddr, address _admin) {
        usdc = IERC20(_usdcAddr);
        admin = _admin;
    }

    /// @notice Create a new campaign with metadata
    /// @param goal Amount to raise in USDC smallest units (e.g. 1 USDC = 1e6)
    /// @param durationSeconds Campaign duration from now (seconds)
    /// @param title Short title for the campaign
    /// @param description Detailed description
    /// @param category Campaign category
    /// @param imageUrl URL pointing to associated image
    /// @param tags List of tags for categorization/search
    function createCampaign(
        uint256 goal,
        uint256 durationSeconds,
        string calldata title,
        string calldata description,
        string calldata category,
        string calldata imageUrl,
        string[] calldata tags
    ) external {
        require(goal > 0, "Goal must be > 0");
        require(durationSeconds > 0, "Duration must be > 0");

        uint256 id = campaignCount++;
        Campaign storage c = campaigns[id];
        c.creator = msg.sender;
        c.goal = goal;
        c.pledged = 0;
        c.deadline = block.timestamp + durationSeconds;
        c.released = false;
        c.title = title;
        c.description = description;
        c.category = category;
        c.imageUrl = imageUrl;
        // Iterate to initialize dynamic tags array
        for (uint i = 0; i < tags.length; i++) {
            c.tags.push(tags[i]);
        }
        campaignIds.push(id);

        emit CampaignCreated(id, msg.sender);
    }

    /// @notice Pledge USDC to a campaign
    function deposit(uint256 id, uint256 amount) external nonReentrant {
        Campaign storage c = campaigns[id];
        require(block.timestamp <= c.deadline, "Campaign ended");
        require(!c.released, "Already finalized");
        require(amount > 0, "Amount > 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        contributions[id][msg.sender] += amount;
        c.pledged += amount;
        emit Pledged(id, msg.sender, amount);
    }

    /// @notice Release funds to creator or admin if campaign succeeds
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

    /// @notice Refund contributor if campaign failed
    function refund(uint256 id) external nonReentrant {
        Campaign storage c = campaigns[id];
        require(block.timestamp > c.deadline, "Campaign ongoing");
        require(c.pledged < c.goal, "Goal was met");

        uint256 bal = contributions[id][msg.sender];
        require(bal > 0, "No contributions");

        contributions[id][msg.sender] = 0;
        require(usdc.transfer(msg.sender, bal), "Refund failed");
        emit Refunded(id, msg.sender, bal);
    }
    // Getters & Setters
    function getAllCampaigns() external view returns (Campaign[] memory) {
        uint256 count = campaignIds.length;
        Campaign[] memory list = new Campaign[](count);
        for (uint i = 0; i < count; i++) {
            list[i] = campaigns[campaignIds[i]];
        }
        return list;
    }
}
