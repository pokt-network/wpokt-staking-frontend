import { usePrepareContractWrite, useContractRead, useBalance } from "wagmi";
import {
  StakeContract,
  RewardContract,
  StakingRewardContract,
} from "./contractAddress";
import { sepolia } from "wagmi";

// types and iterfaces
import { address } from "./types";
import { StakingRewardsABI } from "./abi";
import { use } from "react";

export const useLPTokenBalance = (address: address) =>
  useBalance({
    address,
    token: StakeContract,
    chainId: sepolia.id,
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

  export const useStakeLPToken = (amount:bigint) => usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "stake",
    args: [amount],
    chainId: sepolia.id,
    });