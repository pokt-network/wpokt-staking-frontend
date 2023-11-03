export const StakeContract = process.env
  .NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`;
export const RewardContract = process.env
  .NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const StakingRewardContract = process.env
  .NEXT_PUBLIC_STAKING_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
export const WethContractAddress = process.env
  .NEXT_PUBLIC_WETH_CONTRACT_ADDRESS as `0x${string}`;
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export const POKT_KEY = process.env.NEXT_PUBLIC_APP_POKT_KEY as string;

if (
  !StakeContract ||
  !RewardContract ||
  !StakingRewardContract ||
  !WethContractAddress
) {
  throw new Error("Missing contract addresses");
}

if (!chainId) {
  throw new Error("Missing chain ID");
}
if (isNaN(chainId)) {
  throw new Error("Chain ID is not a number ");
}
if (!POKT_KEY) {
  throw new Error("Missing POKT_KEY");
}
