"use client";
import useSWR from "swr";
// types and iterfaces
import { parseEther } from "viem";
import {
  useBalance,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
} from "wagmi";

import { estimationClient } from "../config";
import { address } from "../types";
import { RewardsABI, StakeABI, StakingRewardsABI } from "./abi";
import {
  chainId,
  RewardContract,
  StakeContract,
  StakingRewardContract,
  WethContractAddress,
} from "./constants";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLPTokenBalance = (address: address) =>
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

export const useRewardTokenBalance = (address: address) =>
  useBalance({
    address,
    token: RewardContract,
    chainId,
  });

export const useStakedTokenBalance = (address: address) =>
  useContractRead({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "balanceOf",
    args: [address],
    chainId,
  });

export const usePendingRewardBalance = (address: address) =>
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
  address: address;
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
  address: address;
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

export const useRewardRate = () => {
  const { data: rewardRate } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "rewardRate",
  });
  const { data: rewardPerTokenStored } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "rewardPerTokenStored",
  });

  const { data: getRewardForDuration } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "getRewardForDuration",
  });

  const { data: rewardsDuration } = useContractRead({
    ...StakingRewardContractObj,
    functionName: "rewardsDuration",
  });

  const { data: MaxLPTokenSupply } = useContractRead({
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

  const { data: ethPrice } = useSWRFetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  );
  const { data: poktPrice } = useSWRFetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=pocket-network&vs_currencies=usd",
  );

  const totalLiquidity =
    Number(wpoktBalance?.formatted) * poktPrice?.["pocket-network"].usd +
    Number(wethBalance?.formatted) * ethPrice?.ethereum.usd;

  // console.log(wpoktBalance, wethBalance, totalLiquidity)
  const rewardPerSecondPerTokenStored =
    Number(rewardPerTokenStored) / Number(rewardsDuration); // reward per token per second (in gwei)?

  const LPTokenValue = totalLiquidity * Number(MaxLPTokenSupply) * 10 ** -18; // in usd

  const rewardPerYearPerToken =
    rewardPerSecondPerTokenStored * 31536000 * 10 ** -6;

  const APR =
    LPTokenValue /
    (rewardPerYearPerToken * Number(poktPrice?.["pocket-network"].usd));

  // console.log(LPTokenValue, rewardPerYearPerToken, poktPrice?.["pocket-network"].usd, APR)
  const DPR = ((Math.pow(1 + APR / 100, 1 / 365) - 1) * 100).toFixed(5);

  return { DPR, LPTokenValue, rewardPerSecondPerTokenStored };
};
