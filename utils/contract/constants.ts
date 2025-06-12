export const StakeContract = process.env
  .NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`;
export const RewardContract = process.env
  .NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const StakingRewardContract = process.env
  .NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const WethContractAddress = process.env
  .NEXT_PUBLIC_WETH_CONTRACT_ADDRESS as `0x${string}`;
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;

export const PROJECT_ID = process.env.NEXT_PUBLIC_APP_PROJECT_ID as string;

if (
  !StakeContract ||
  !RewardContract ||
  !StakingRewardContract ||
  !WethContractAddress
) {
  throw new Error("Missing contract address env variables");
}

if (!chainId) {
  throw new Error("Missing NEXT_PUBLIC_CHAIN_ID");
}
if (isNaN(chainId)) {
  throw new Error("NEXT_PUBLIC_CHAIN_ID is not a number");
}
if (!RPC_URL) {
  throw new Error("Missing NEXT_PUBLIC_RPC_URL");
}
if (!PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_APP_PROJECT_ID");
}

