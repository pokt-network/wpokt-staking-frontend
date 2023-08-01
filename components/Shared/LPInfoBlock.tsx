;
import { Link } from "@chakra-ui/next-js";
import { VStack, Text, HStack } from "@chakra-ui/react";
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
        </Text>
        <Link href={"/"} textColor={"poktLime"} textDecoration={"underline"}>
          here.
        </Link>
      </HStack>
      <HStack>
        <Text>Farming uses this SNX Rewards contract </Text>
        <Link href={"/"} textColor={"poktLime"} textDecoration={"underline"}>
          here.
        </Link>
      </HStack>
    </VStack>
  );
}
