export const StakeContract = process.env
  .NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`;
export const RewardContract = process.env
  .NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const StakingRewardContract = process.env
  .NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const WethContractAddress = process.env
  .NEXT_PUBLIC_WETH_CONTRACT_ADDRESS as `0x${string}`;
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

if (
  !StakeContract ||
  !RewardContract ||
  !StakingRewardContract ||
  !WethContractAddress ||
  !chainId ||
  isNaN(chainId)
) {
  throw new Error("Missing contract addresses");
}
