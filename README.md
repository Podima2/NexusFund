# 🌐 NEXUSFUND

A decentralized crowdfunding social dApp enabling **cross-chain stablecoin pledges**, held in escrow on a single chain and released atomically using Avail Nexus SDK’s `bridgeAndExecute()`. Contributors pledge from any chain — funds are bridged and deposited in one seamless transaction. Once the goal is met, funds are released or refunded with another atomic call.

---

## 🚀 Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Demo](#demo)  
4. [Getting Started](#getting-started)  
   - Prerequisites  
   - Smart Contract Deployment  
   - Frontend Setup  
5. [Usage](#usage)  
   - Pledge  
   - Release Funds 
6. [Built With](#built-with)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Acknowledgements](#acknowledgements)

---

## ✨ Features

- **Atomic cross-chain pledges**: Contributors use `bridgeAndExecute()` to pledge stablecoins from any chain directly into escrow.  
- **Unified goal tracking**: Total pledges are aggregated on a single contract, regardless of source chain.  
- **Single-contract logic**: All core escrow logic (deposit/release/refund) exists on one chain.  
- **Secure fund flows**: Once the target is met, funds are released; otherwise, refunds are enabled.  
- **Single-call UX**: Bridging and execution happen in a single, SDK-driven transaction.

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

````

- Smart contract deployed on one chain (e.g., Ethereum).  
- `bridgeAndExecute()` handles bridging and execution in one transaction.  
- Escrow contract tracks campaign status and contributor balances.

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
git clone https://github.com/yourusername/global-crowdfund-escrow.git
cd global-crowdfund-escrow
npm install
````

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
npm start
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


