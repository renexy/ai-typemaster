
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    const deployerAddress = "0x6eeE943FD6314C7Ef86D2F78DeF6f0452EBB4dc8";
    console.log("Deploying contracts with the address:", deployerAddress);

    const profileOwnerAddress = deployerAddress;

    const SimpleAMA = await ethers.getContractFactory("SimpleAMA");

    const simpleAMA = await SimpleAMA.deploy(profileOwnerAddress);
    console.log("SimpleAMA contract deployed to:", simpleAMA);
}

// async function checkDeployment() {
//     // Replace with the deployed contract address
//     const contractAddress = "0x61d397d2c872F521c0A0BCD13d1cb31ec2c8Bc05";

//     const contract = await ethers.getContractAt("SimpleAMA", contractAddress);

//     const balance = await ethers.provider.getBalance(contractAddress);

//     // Check the contract's balance (for example)
//     console.log(`Balance of contract ETH ${balance}`);
// }

// checkDeployment()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

    // async function interactWithContract() {
    //     // Get the contract instance
    //     const SimpleAMA = await ethers.getContractFactory("SimpleAMA");
    //     const contract = await SimpleAMA.attach("0x61d397d2c872F521c0A0BCD13d1cb31ec2c8Bc05");
    
    //     // Interact with the contract: Call claimFreeToken
    //     const [deployer] = await ethers.getSigners();
    //     console.log("Claiming free token for:", deployer.address);
    //     const hasClaimed = await contract.hasReceivedToken(deployer.address);
    //     console.log(`Has claimed free token: ${hasClaimed}`);
    
    //     // Call claimFreeToken
    //     const claimTx = await contract.claimFreeToken();
    //     console.log("Claim transaction:", claimTx.hash);
    
    //     // Wait for the transaction to be mined
    //     await claimTx.wait();
    //     console.log("Claimed free token!");
    
    //     // Now, let's check the public questions
    //     const publicQuestions = await contract.getPublicQuestions();
    //     console.log("Public questions:", publicQuestions);
    // }
    
    // interactWithContract()
    //     .then(() => process.exit(0))
    //     .catch((error) => {
    //         console.error(error);
    //         process.exit(1);
    //     });

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

