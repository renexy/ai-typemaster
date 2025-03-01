/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createPublicClient,
  custom,
  decodeFunctionResult,
  encodeFunctionData,
  http,
} from "viem";
import { lukso, luksoTestnet } from "viem/chains";
import abi from "../../../artifacts/contracts/ama.sol/SimpleAMA.json";

const contractAddress = import.meta.env.VITE_LUKSO_CONTRACT_ADDRESS;

export const hasProfile = async (provider: any, account: any, chainId: any) => {
  try {
    const client = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "hasProfile",
      args: [account],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "hasProfile",
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching if already has profile:", error);
    return true;
  }
};

export const createProfileForUser = async (
  account: any,
  client: any,
  chainId: any
) => {
  try {
    const txHash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      functionName: "createProfile",
      args: [],
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

    return txHash;
  } catch (error) {
    console.error("Error creating profile:", error);
    return false; // Handle error appropriately
  }
};

export const claimTokenForProfile = async (
  walletClient: any,
  account: any,
  contextWallet: any,
  chainId: any
) => {
  try {
    const txHash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      functionName: "claimFreeToken",
      args: [contextWallet],
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

export const hasRecievedTokenForProfile = async (
  provider: any,
  account: any,
  contextAccount: any,
  chainId: any
) => {
  if (!contextAccount) return;
  try {
    const client = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "hasReceivedToken",
      args: [contextAccount, account],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "hasReceivedToken",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching already submitted check:", error);
    return true;
  }
};

export const createQuestionForProfile = async (
  account: any,
  client: any,
  contextWallet: any,
  questionText: string,
  chainId: any
) => {
  try {
    const publicClient = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: http(),
    });

    const txHash = await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      functionName: "submitQuestion",
      args: [contextWallet, questionText],
      account: account,
    });

    console.log(txHash, "hash");

    await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return txHash;
  } catch (error) {
    console.error("Error creating question:", error);
    return false;
  }
};

export const answerQuestionForProfile = async (
  account: any,
  answer: string,
  questionId: number,
  walletClient: any,
  chainId: any
) => {
  try {
    const publicClient = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: http(),
    });

    const txHash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: abi.abi,
      functionName: "answerQuestion",
      args: [questionId, answer],
      account: account,
    });
    
    console.log("Transaction Hash:", txHash);

    
    await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return 1;
  } catch (error) {
    console.error("Error answering", error);
    return -1;
  }
};

export const hasSubmittedQuestionForProfile = async (
  provider: any,
  contextWallet: any,
  account: any,
  chainId: any
) => {
  try {
    const client = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "hasAskedQuestion",
      args: [contextWallet, account],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "hasAskedQuestion",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching already submitted check:", error);
    return true;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchQuestionsForProfile = async (
  provider: any,
  contextWallet: any,
  chainId: any
) => {
  if (!contextWallet) return;
  try {
    const client = createPublicClient({
      chain: chainId === 42 ? lukso : luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "getAllQuestions",
      args: [contextWallet],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "getAllQuestions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching public questions:", error);
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasSubmittedQuestion = async (provider: any, account: any) => {
  try {
    const client = createPublicClient({
      chain: luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "hasSubmittedQuestion",
      args: [account],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "hasSubmittedQuestion",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching already submitted check:", error);
    return true;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFQTAmount = async (provider: any, account: any) => {
  try {
    const client = createPublicClient({
      chain: luksoTestnet,
      transport: custom(provider),
    });

    const data = encodeFunctionData({
      abi: abi.abi,
      functionName: "getFQTBalance",
      args: [account],
    });

    const result = await client.call({
      to: contractAddress as `0x${string}`,
      data: data,
    });

    const decodedResult = decodeFunctionResult({
      abi: abi.abi,
      functionName: "getFQTBalance",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (result.data as any).result as `0x${string}`,
    });

    return decodedResult;
  } catch (error) {
    console.error("Error fetching FQT amount:", error);
    return true;
  }
};
