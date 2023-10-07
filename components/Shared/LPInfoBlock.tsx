"use client";
import { HStack, Link, Text, VStack } from "@chakra-ui/react";

import {
  chainId,
  StakeContract,
  StakingRewardContract,
} from "@/utils/contract/constants";

const getPoolLink = () => `https://v2.info.uniswap.org/pair/${StakeContract}`;

const getRewardsLink = () =>
  chainId === 1
    ? `https://etherscan.io/address/${StakingRewardContract}#code`
    : `https://goerli.etherscan.io/address/${StakingRewardContract}#code`;

export default function LPInfoBlock() {
  return (
    <VStack
      flexDirection={"column"}
      justify="center"
      align="center"
      fontSize={"16"}
      gap={8}
      paddingY={16}
      textAlign={"center"}
    >
      <Text>Stake your wPOKT-ETH LP tokens to earn wPOKT.</Text>
      <HStack>
        <Text>
          You can get wPOKT-ETH LP tokens by providing liquidity on Uniswap{" "}
          <Link
            _hover={{ color: "white" }}
            href={getPoolLink()}
            textColor={"poktLime"}
            textDecoration={"underline"}
            isExternal
          >
            here.
          </Link>
        </Text>
      </HStack>
      <HStack>
        <Text>
          Farming uses this SNX Rewards contract{" "}
          <Link
            _hover={{ color: "white" }}
            href={getRewardsLink()}
            textColor={"poktLime"}
            textDecoration={"underline"}
            isExternal
          >
            here.
          </Link>
        </Text>
      </HStack>
    </VStack>
  );
}
