/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createPublicClient,
  http,
} from "viem";
import { lukso, luksoTestnet } from "viem/chains";
import abi from "../../../artifacts/contracts/typingGae.sol/TypingLeaderboardNFT.json"

const contractAddress = import.meta.env.VITE_LUKSO_CONTRACT_ADDRESS;
export const claimTokenForProfile = async (
  walletClient: any,
  account: any,
  chainId: any
) => {
  try {
    const txHash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      functionName: "submitScore",
      args: [1, 2, "mySecret123"],
      account: account,
    });

    const publicClient = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: http(),
    });

    console.log(txHash, "hash");

    await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return 1;
  } catch (error) {
    console.error("Error claiming free token:", error);
    return -1;
  }
};