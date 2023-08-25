"use client";
import {
  sepolia,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import { estimationClient } from "../config";
import useSWR from "swr";
import {
  RewardContract,
  StakeContract,
  StakingRewardContract,
} from "./contractAddress";
// types and iterfaces
import { parseEther } from "viem";
import { address } from "../types";
import { StakeABI, StakingRewardsABI } from "./abi";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export const useSWRFetch = (url: string) => useSWR(url, fetcher);

export const useRegularGasEstimate = (args: {
  method: string;
  address: address;
  amount: number;
}) => {
  const shouldFetch = args.method && args.address && typeof args.amount === 'number';
  const key = shouldFetch ? ['estimateContractGas', args.method, args.address, args.amount] : null;

  const { data, error } = useSWR(key, () =>
    estimationClient.estimateContractGas({
      abi: StakingRewardsABI,
      address: StakingRewardContract,
      functionName: args.method,
      account: args.address,
      args: [parseEther(String(args.amount))],
    })
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useApprovalGasEstimate = (args: {
  address: address;
  amount: number;
}) => {
  const shouldFetch = args.address && typeof args.amount === 'number';
  const key = shouldFetch ? ['estimateContractGas', 'approve', args.address, args.amount] : null;

  const { data, error } = useSWR(key, () =>
    estimationClient.estimateContractGas({
      abi: StakeABI,
      address: StakeContract,
      functionName: "approve",
      account: args.address,
      args: [StakingRewardContract, parseEther(String(args.amount))],
    })
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};