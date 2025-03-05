
import abi from "../artifacts/contracts/typingGae.sol/TypingLeaderboardNFT.json" with { type: "json" }
import { ERC725 } from '@erc725/erc725.js';
import metadataJson from "../jsons/collectionMetadata.json" with { type: "json" }
import metadataJsonEasy from "../jsons/firstplace.json" with { type: "json" }
import { ethers } from "ethers";

async function main() { 
    try {
        const TypingLeaderboardNFT = await ethers.getContractFactory(
            "TypingLeaderboardNFT"
          );
        
          const typingLeaderboardNFT = await TypingLeaderboardNFT.deploy(
            "Typing leaderboard",
            "TLNFT",
            process.env.LUKSO_PUBLIC_KEY,
            1,
            0,
            process.env.SECRET_KEY
          );
          console.log("TypingLeaderboardNFT contract deployed to:", typingLeaderboardNFT);
    } catch (err) {
        console.log(err, 'lol');
    }
}

async function setCollectionMetadata() {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lukso.network");
  const wallet = new ethers.Wallet("0x43361a4e65f999bb2fe735d873f393763a931121a4f4ee4d775e8a3cd228a34a", provider);
  
  const universalProfileAddress = "0x61d397d2c872F521c0A0BCD13d1cb31ec2c8Bc05";
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
        url: "ipfs://bafkreiegzm55gle3yn6hnbehqhb5zpm37bc7722daubusaey6ukaqywg4a",
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
    "0x67E05cF94d89ad671Ed23c51D2ABA77E7102d4E1", // target contract
    0, // value (0 ETH)
    setDataData // encoded setData call
  );
  await tx.wait();
}

async function setTokenIdMetadata() {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lukso.network");
  const wallet = new ethers.Wallet("0x43361a4e65f999bb2fe735d873f393763a931121a4f4ee4d775e8a3cd228a34a", provider);
  
  const universalProfileAddress = "0x61d397d2c872F521c0A0BCD13d1cb31ec2c8Bc05";
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
        json: metadataJsonEasy,
        url: "ipfs://bafkreih6dzat6uajmbcsz2btlyk6mphcuuireqrpp2iunqt2ykwv4g5lku",
      },
    },
  ]);

  // Encode the setData function call
  const setDataInterface = new ethers.Interface([
    "function setDataForTokenId(bytes32 tokenId, bytes32 key, bytes value) external"
  ]);

  let difficulty = 1; // Example difficulty
  let tokenId = ethers.zeroPadValue(ethers.toBeHex(difficulty), 32);

  const setDataData = setDataInterface.encodeFunctionData("setDataForTokenId", [
    tokenId,
    encodedData.keys[0],
    encodedData.values[0]
  ]);

  // Call execute on the Universal Profile
  const tx = await universalProfile.execute(
    0, // CALL operation
    "0x67E05cF94d89ad671Ed23c51D2ABA77E7102d4E1", // target contract
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
