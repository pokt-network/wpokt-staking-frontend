"use client";
import useSWR from "swr";
// types and iterfaces
import { Address, formatUnits, parseEther } from "viem";
import { useBalance, useContractRead, usePrepareContractWrite } from "wagmi";

import { TokenUSDPrices } from "@/context/Globals";

import { estimationClient } from "../config";
import { StakeABI, StakingRewardsABI } from "./abi";
import {
  chainId,
  RewardContract,
  StakeContract,
  StakingRewardContract,
  WethContractAddress,
} from "./constants";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLPTokenBalance = (address: Address) =>
  useBalance({
    address,
    token: StakeContract,
    chainId,
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
    chainId,
    enabled: args.isValidAmount && Number(args.amount) != 0,
  });

export const useRewardTokenBalance = (address: Address) =>
  useBalance({
    address,
    token: RewardContract,
    chainId,
  });

export const useStakedTokenBalance = (address: Address) =>
  useContractRead({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "balanceOf",
    args: [address],
    chainId,
  });

export const usePendingRewardBalance = (address: Address) =>
  useContractRead({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "earned",
    args: [address],
    chainId,
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
    chainId,
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
    chainId,
    enabled: args.isValidAmount && Number(args.amount) != 0,
  });
export const useClaimReward = (pendingRewardBal: number) =>
  usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "getReward",
    args: [],
    chainId,
    enabled: Boolean(pendingRewardBal),
  });

export const useSWRFetch = (url: string) => useSWR(url, fetcher);

export const useRegularGasEstimate = (args: {
  method: string;
  address: Address;
  amount: number;
}) => {
  const shouldFetch =
    args.method && args.address && typeof args.amount === "number";
  const key = shouldFetch
    ? ["estimateContractGas", args.method, args.address, args.amount]
    : null;

  const { data, error } = useSWR(key, () =>
    estimationClient.estimateContractGas({
      abi: StakingRewardsABI,
      address: StakingRewardContract,
      functionName: args.method,
      account: args.address,
      args: [parseEther(String(args.amount))],
    }),
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useApprovalGasEstimate = (args: {
  address: Address;
  amount: number;
}) => {
  const shouldFetch = args.address && typeof args.amount === "number";
  const key = shouldFetch
    ? ["estimateContractGas", "approve", args.address, args.amount]
    : null;

  const { data, error } = useSWR(key, () =>
    estimationClient.estimateContractGas({
      abi: StakeABI,
      address: StakeContract,
      functionName: "approve",
      account: args.address,
      args: [StakingRewardContract, parseEther(String(args.amount))],
    }),
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

const StakingRewardContractObj = {
  address: StakingRewardContract,
  abi: StakingRewardsABI,
  chainId,
};

const NUM_SECONDS_IN_DAY = BigInt(86400);

export const useRewardRate = (totalStaked: bigint, prices: TokenUSDPrices) => {
  const { data: rewardRate } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "rewardRate",
  });

  const { data: totalStakeSupply } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "totalSupply",
  });

  const { data: totalLPTokenSupply } = useContractRead({
    address: StakeContract,
    abi: StakeABI,
    functionName: "totalSupply",
  });

  const { data: wethBalance } = useBalance({
    address: StakeContract,
    token: WethContractAddress,
    chainId,
  });

  const { data: wpoktBalance } = useBalance({
    address: StakeContract,
    token: RewardContract,
    chainId,
  });

  const totalLPUSDValue =
    Number(wpoktBalance?.formatted) * Number(prices.pokt) +
    Number(wethBalance?.formatted) * Number(prices.eth);

  const singleLPTokenUSDValue =
    totalLPUSDValue /
    Number(formatUnits((totalLPTokenSupply as bigint) ?? BigInt(0), 18));

  const totalStakedLPTokenUSDValue = (
    Number(formatUnits(BigInt(totalStaked), 18)) * singleLPTokenUSDValue
  ).toFixed(6);

  const rewardRatePerDay = (rewardRate as bigint) * NUM_SECONDS_IN_DAY;

  const rewardPerTokenPerDay =
    (totalStakeSupply as bigint) === BigInt(0)
      ? Number(0)
      : Number(rewardRatePerDay) /
        Number(formatUnits(BigInt(totalStakeSupply as bigint), 18));

  const totalRewardPerDay =
    rewardPerTokenPerDay *
    Number(formatUnits(BigInt(totalStaked), 18)) *
    10 ** -6;

  const totalRewardPerDayUSDValue = (
    totalRewardPerDay * Number(prices.pokt)
  ).toFixed(6);

  const DPR =
    totalStakedLPTokenUSDValue === (0).toFixed(6)
      ? (0).toFixed(2)
      : (
          (Number(totalRewardPerDay) / Number(totalStakedLPTokenUSDValue)) *
          100.0
        ).toFixed(2);

  return {
    DPR,
    totalStakedLPTokenUSDValue,
    totalRewardPerDayUSDValue,
  };
};
