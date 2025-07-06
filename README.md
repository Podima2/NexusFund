# 🌐 NexusFund

**The cross-chain crowdfunding dApp for the next generation of global projects.**

NexusFund lets anyone launch or support campaigns with stablecoins from any blockchain. Using Avail Nexus SDK's `bridgeAndExecute()`, contributors can seamlessly pledge funds cross-chain—no matter where their assets are held. All pledges are securely bridged and held in escrow on a single chain, ensuring transparent, atomic release or refund of funds when campaign goals are met or missed.

---
# Presentation

[Watch me! :)](https://www.canva.com/design/DAGsX0uc-NY/Dd_Q4h321JjSrgQndsAXXQ/edit?utm_content=DAGsX0uc-NY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 🚀 Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Smart Contract Overview](#smart-contract-overview)  
4. [Demo](#demo)  
5. [Getting Started](#getting-started)  
6. [Usage](#usage)  
7. [Built With](#built-with)  
8. [Contributing](#contributing)  
9. [License](#license)  
10. [Acknowledgements](#acknowledgements)

---

## ✨ Features

- **Cross-chain pledges:** Pledge stablecoins from any supported blockchain.
- **Unified escrow:** All funds are held and managed on a single chain for transparency.
- **Atomic execution:** Bridging and contract calls happen in a single transaction.
- **Goal-based release:** Funds are released or refunded automatically based on campaign outcome.
- **Modern UX:** One-click pledging, real-time updates, and social features.

---

## 🧩 Architecture

```
User (Polygon, BSC, etc.)
│
\[Nexus bridge]
│
Escrow Contract ← Frontend/App
│
Campaign Logic: deposit(), release(), refund()

```

- Smart contract deployed on one chain (e.g., Base Sepolia).  
- `bridgeAndExecute()` handles bridging and execution in one transaction.  
- Escrow contract tracks campaign status and contributor balances.

---

## 📝 Smart Contract Overview

**Deployed Address (Base Sepolia):**  
[`0x4951992d46fa57c50Cb7FcC9137193BE639A9bEE`](https://sepolia.basescan.org/address/0x4951992d46fa57c50Cb7FcC9137193BE639A9bEE)

The core escrow contract is deployed on a single chain (e.g., Base Sepolia) and manages all campaign logic and funds in USDC (6 decimals). It is designed for seamless cross-chain pledges via Avail Nexus.

### Campaign Struct
```solidity
struct Campaign {
    address creator;     // Campaign owner
    uint256 goal;        // Target USDC amount (in 1e6 units)
    uint256 pledged;     // Current pledged amount
    uint256 deadline;    // UNIX timestamp deadline
    bool released;       // Whether funds have been released
    string title;        // Campaign title
    string description;  // Detailed description
    string category;     // Category (e.g. "Art", "Tech")
    string imageUrl;     // URL for campaign image
    string[] tags;       // Tags for search & categorization
}
```

### Main Functions
- `createCampaign(goal, durationSeconds, title, description, category, imageUrl, tags)`  
  Create a new campaign with metadata and a funding goal.
- `deposit(id, amount)`  
  Pledge USDC to a campaign. Can be called via cross-chain bridge.
- `release(id)`  
  Release funds to the creator/admin if the campaign is successful (goal met, deadline passed).
- `refund(id)`  
  Refund contributors if the campaign fails (goal not met, deadline passed).
- `getAllCampaigns()`  
  Returns all campaigns and their metadata.

All funds are held in escrow until the campaign is finalized (released or refunded). The contract is compatible with Avail Nexus cross-chain bridging and execution.

---

## 🎥 Demo

> 🎥 *Embed a short demo GIF or video here showcasing a cross-chain pledge and release sequence.*

---

## 🛠️ Getting Started

### Prerequisites

- Node.js ≥14 + npm  
- Hardhat / Foundry (any Solidity dev framework)  
- Metamask (or other Web3 wallet) configured with testnets (Ethereum, Polygon, etc.)

### 1. Clone & Install

```bash
git clone https://github.com/Podima2/NexusFund
cd NexusFund
npm install
```

### 2. Deploy Smart Contract

Configure network and campaign in:

* `hardhat.config.js`
* `.env`

Run deployment:

```bash
npx hardhat run scripts/deploy.js --network <escrowChain>
```

### 3. Configure Frontend

Copy `.env.example` → `.env` and add:

```
REACT_APP_ESCROW_ADDRESS=<deployed_contract_address>
REACT_APP_NEXUS_API=<nexus_rpc_endpoint>
```

Install & start frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 🧭 Usage

### Pledge Funds

Select your source chain and pledge amount, then click **Pledge**. This triggers:

```js
await nexus.bridgeAndExecute({
  srcChain,
  destChain: ESCROW_CHAIN,
  token: "USDC",
  amount: pledgeAmount,
  targetContract: escrowAddress,
  encodedCallData: escrowInterface.encodeFunctionData("deposit", [campaignId, pledgeAmount])
});
```

### Release Funds

After goal is reached, click **Release Funds**, invoking:

```js
await nexus.bridgeAndExecute({
  srcChain: ESCROW_CHAIN,
  destChain: RECIPIENT_CHAIN,
  token: "USDC",
  amount: totalPledged,
  targetContract: escrowAddress,
  encodedCallData: escrowInterface.encodeFunctionData("release", [campaignId])
});
```

---

## 🧱 Built With

* **[Avail Nexus SDK](https://docs.availproject.org/docs/build-with-avail/avail-nexus/overview)** – atomic cross-chain calls
* **Solidity** – Escrow campaign management
* **Ethers.js**, React – frontend + transaction flow
* **Hardhat** – development & testing
* **Metamask** – for wallet integration

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ at an EthGlobal Cannes hackathon using Avail Nexus.*


