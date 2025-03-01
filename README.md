# React + TypeScript + Vite

Before starting, run

```js
npm install
```
To start, use
```js
npm run dev
```

# To deploy and use on your own profile as owner

Create an .env file in the root folder of the project

```dotenv
# Server configuration
LUKSO_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY -- but remove the 0x at the start of it
LUKSO_PUBLIC_KEY=YOUR_PUBLIC_WALLET-KEY -- leave the 0x in here
VITE_LUKSO_CONTRACT_ADDRESS= leave empty for now! - fill later with deployed contract address
```

To deploy your smart contract on testnet, run

```js
npx hardhat run scripts/deploy.js --network luksoTestnet
```

To deploy your smart contract on mainnet, run

```js
npx hardhat run scripts/deploy.js --network luksoMainnet
```

After deploying, you need to verify the contract; to do this, copy the target address of the result of the above script, and run

```js
npx hardhat verify YOUR_DEPLOYED_CONTRACT_ADDRESS --constructor-args ./verify/ama.ts --network luksoTestnet|luksoMainnet
```

After verifying, feel free to host this application on vercel; make sure to input the .env file into the deployment variables.
