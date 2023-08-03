import {
  sepolia,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import { estimationClient } from "../config";
import {
  RewardContract,
  StakeContract,
  StakingRewardContract,
} from "./contractAddress";
// types and iterfaces
import { StakingRewardsABI, StakeABI } from "./abi";
import { address } from "./types";
import { useGlobalContext } from "@/context/Globals";

export const useLPTokenBalance = (address: address) =>
  useBalance({
    address,
    token: StakeContract,
    chainId: sepolia.id,
  });

export const useApproveLPToken = (args: {
  amount: bigint;
  isValidAmount: boolean;
}) =>
  usePrepareContractWrite({
    abi: StakeABI,
    address: StakeContract,
    functionName: "approve",
    args: [StakingRewardContract, args.amount],
    chainId: sepolia.id,
    enabled: args.isValidAmount && args.amount != BigInt(0),
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
  amount: bigint;
  isValidAmount: boolean;
}) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "stake",
    args: [args.amount],
    chainId: sepolia.id,
    enabled: args.isValidAmount && args.amount != BigInt(0),
  });

export const useUnstakeLPToken = (args: {
  amount: bigint;
  isValidAmount: boolean;
}) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "withdraw",
    args: [args.amount],
    chainId: sepolia.id,
    enabled: args.isValidAmount && args.amount != BigInt(0),
  });

export const useGasEstimate = (args: {
  method: string;
  amount: bigint;
  address: address;
}) =>
  estimationClient.estimateContractGas({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: args.method,
    args: [args.amount],
    account: args.address,
  });

export const useApprovalEstimate = (args: {
  method: string;
  amount: bigint;
  address: address;
}) =>
  estimationClient.estimateContractGas({
    abi: StakeABI,
    address: StakeContract,
    functionName: "approve",
    args: [StakingRewardContract, args.amount],
    account: args.address,
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
