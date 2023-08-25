import { CHAINLINK_ETH_USD_ADDRESS } from "./contractAddress";
import useSWR from "swr";
import {
  sepolia,
  useBalance,
  useContractRead,
  useFeeData,
  usePrepareContractWrite,
} from "wagmi";
import { estimationClient } from "../config";
import {
  RewardContract,
  StakeContract,
  StakingRewardContract,
} from "./contractAddress";
// types and iterfaces
import { parseEther } from "viem";
import { address } from "../types";
import { CHAINLINK_AGGREGATOR_V3_INTERFACE_ABI, StakeABI, StakingRewardsABI } from './abi';
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const useSWRFetch = (url: string) => useSWR(url, fetcher);


export const useLPTokenBalance = (address: address) =>
  useBalance({
    address,
    token: StakeContract,
    chainId: sepolia.id,
  });

export const useApproveLPToken = (args: {
  amount: string;
  isValidAmount: boolean;
}) =>
  usePrepareContractWrite({
    abi: StakeABI,
    address: StakeContract,
    functionName: "approve",
    args: [StakingRewardContract, parseEther(args.amount.toString())],
    chainId: sepolia.id,
    enabled: args.isValidAmount && Number(args.amount) != 0,
  });

export const useRewardTokenBalance = (address: address) =>
  useBalance({
    address,
    token: RewardContract,
    chainId: sepolia.id,
  });

export const useStakedTokenBalance = (address: address) =>
  useContractRead({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "balanceOf",
    args: [address],
    chainId: sepolia.id,
  });

export const usePendingRewardBalance = (address: address) =>
  useContractRead({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "earned",
    args: [address],
    chainId: sepolia.id,
  });

export const useStakeLPToken = (args: {
  amount: string;
  isValidAmount: boolean;
  onError?: (error: any) => void;
}) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "stake",
    args: [parseEther(args.amount)],
    chainId: sepolia.id,
    enabled: args.isValidAmount && Number(args.amount) != 0,
    onError: args.onError,
  });

export const useUnstakeLPToken = (args: {
  amount: string;
  isValidAmount: boolean;
}) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "withdraw",
    args: [parseEther(String(args.amount))],
    chainId: sepolia.id,
    enabled: args.isValidAmount && Number(args.amount) != 0,
  });
export const useClaimReward = (pendingRewardBal: number) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "getReward",
    args: [],
    chainId: sepolia.id,
    enabled: Boolean(pendingRewardBal),
  });

export const useEstimateGas = (
  args: {
    method: string,
    address: address,
    amount: number,
    isApproval: boolean,
  }
) => {
  // Destructure the arguments
  const { method, address, amount, isApproval } = args;
  let estimatedGas = BigInt(0);
  // Make a request for the current fee data.
  const { data: gas } = useFeeData();

  const estimateGas = async () => {
    const contractABI = isApproval ? StakeABI : StakingRewardsABI;
    const contractAddress = isApproval ? StakeContract : StakingRewardContract;

    // Return gas price if address or amount is empty
    if (!address || !amount) {
      return BigInt(gas?.gasPrice ?? 0);
    }

    // Begin estimation of gas
    const gasEstimationResult = await estimationClient.estimateContractGas({
      abi: contractABI as unknown as any,
      address: contractAddress,
      functionName: method,
      account: address,
      args: [parseEther(String(amount))],
    });

    // Handle estimation failure by falling back on gas price or return the estimation
    if (!gasEstimationResult) {
      estimatedGas = BigInt(gas?.gasPrice ?? 0);
      
    }
    else {
      estimatedGas = gasEstimationResult;
    }

    
  };

  return estimatedGas;
};


export const usePriceData = () => {
  const { data: priceData } = useContractRead({
    address: CHAINLINK_ETH_USD_ADDRESS,
    abi: CHAINLINK_AGGREGATOR_V3_INTERFACE_ABI,
    functionName: "latestRoundData",
  });

  return priceData as bigint[];
};