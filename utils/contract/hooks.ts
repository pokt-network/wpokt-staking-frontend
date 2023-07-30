import { sepolia, useBalance, useContractRead, usePrepareContractWrite } from "wagmi";
import {
  RewardContract,
  StakeContract,
  StakingRewardContract,
} from "./contractAddress";

// types and iterfaces
import { StakingRewardsABI } from "./abi";
import { address } from "./types";

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

  export const useStakeLPToken = (args:{amount:bigint}) => usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "stake",
    args: Array.from(Object.values(args)),
    chainId: sepolia.id,
    });

  export const useUnstakeLPToken = (args:{amount:bigint}) => usePrepareContractWrite({
    abi: StakingRewardsABI,
    address: StakingRewardContract,
    functionName: "withdraw",
    args: Array.from(Object.values(args)),
    chainId: sepolia.id,
    });