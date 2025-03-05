
import abi from "../artifacts/contracts/typingGae.sol/TypingLeaderboardNFT.json" with { type: "json" }
import { ERC725 } from '@erc725/erc725.js';
import metadataJson from "../jsons/collectionMetadata.json" with { type: "json" }
import metadataJsonEasy from "../jsons/firstplace.json" with { type: "json" }
import metadataJsonNormal from "../jsons/firstplacenormal.json" with { type: "json" }
import metadataJsonHard from "../jsons/firstplacehard.json" with { type: "json" }
import { ethers } from "ethers";

// async function main() { 
//     try {
//         const TypingLeaderboardNFT = await ethers.getContractFactory(
//             "TypingLeaderboardNFT"
//           );
        
//           const typingLeaderboardNFT = await TypingLeaderboardNFT.deploy(
//             "Typing leaderboard",
//             "TLNFT",
//             process.env.LUKSO_PUBLIC_KEY,
//             1,
//             0,
//             process.env.SECRET_KEY
//           );
//           console.log("TypingLeaderboardNFT contract deployed to:", typingLeaderboardNFT);
//     } catch (err) {
//         console.log(err, 'lol');
//     }
// }

async function setCollectionMetadata() {
  // const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lukso.network");
  const provider = new ethers.JsonRpcProvider("https://42.rpc.thirdweb.com", {
  chainId: 42, // Use the correct chain ID for your network
  name: "lukso", // Replace with the actual network name if it's different
});
  const wallet = new ethers.Wallet("pk", provider);
  
  const universalProfileAddress = "publickey";
  const ABI = [
    "function execute(uint256 operationType, address target, uint256 value, bytes calldata data) external returns (bytes)"
  ];

  const universalProfile = new ethers.Contract(
    universalProfileAddress,
    ABI,
    wallet
  );

  const schema = [
    {
      name: 'LSP4Metadata',
      key: '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
      keyType: 'Singleton',
      valueType: 'bytes',
      valueContent: 'VerifiableURI',
    },
  ];

  const erc725 = new ERC725(schema);

  const encodedData = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: metadataJson,
        url: "ipfs://bafkreialflecdyxxh6ubflw2ou4dtp5evwkuzeupbkt57yam3cnsdot5je",
      },
    },
  ]);

  // Encode the setData function call
  const setDataInterface = new ethers.Interface([
    "function setData(bytes32 key, bytes value) external"
  ]);
  const setDataData = setDataInterface.encodeFunctionData("setData", [
    encodedData.keys[0],
    encodedData.values[0]
  ]);

  // Call execute on the Universal Profile
  const tx = await universalProfile.execute(
    0, // CALL operation
    "contract", // target contract
    0, // value (0 ETH)
    setDataData // encoded setData call
  );
  await tx.wait();
}

async function setTokenIdMetadata() {
  const provider = new ethers.JsonRpcProvider("https://42.rpc.thirdweb.com", {
    chainId: 42, // Use the correct chain ID for your network
    name: "lukso", // Replace with the actual network name if it's different
  });
  const wallet = new ethers.Wallet("pk", provider);
  
  const universalProfileAddress = "public";
  const ABI = [
    "function execute(uint256 operationType, address target, uint256 value, bytes calldata data) external returns (bytes)"
  ];

  const universalProfile = new ethers.Contract(
    universalProfileAddress,
    ABI,
    wallet
  );

  const schema = [
    {
      name: 'LSP4Metadata',
      key: '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e',
      keyType: 'Singleton',
      valueType: 'bytes',
      valueContent: 'VerifiableURI',
    },
  ];

  const erc725 = new ERC725(schema);

  const encodedData = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: metadataJsonHard,
        url: "ipfs://bafkreihapve4bymchny6xkivjmltgfpp4abz5drkyeq755dmd7t67xn6nu",
      },
    },
  ]);

  // Encode the setData function call
  const setDataInterface = new ethers.Interface([
    "function setDataForTokenId(bytes32 tokenId, bytes32 key, bytes value) external"
  ]);

  let difficulty = 3; // Example difficulty
  let tokenId = ethers.zeroPadValue(ethers.toBeHex(difficulty), 32);

  const setDataData = setDataInterface.encodeFunctionData("setDataForTokenId", [
    tokenId,
    encodedData.keys[0],
    encodedData.values[0]
  ]);

  // Call execute on the Universal Profile
  const tx = await universalProfile.execute(
    0, // CALL operation
    "contract", // target contract
    0, // value (0 ETH)
    setDataData // encoded setData call
  );
  await tx.wait();
}


setTokenIdMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
