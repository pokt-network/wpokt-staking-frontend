import { VStack, Link, Text } from "@chakra-ui/react"
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
          <Text>
            You can get wPOKT-ETH LP tokens by providing liquidity on Uniswap{" "}
            <Link textColor={"poktLime"} textDecoration={"underline"}>
              here.
            </Link>
          </Text>
          <Text>
            Farming uses this SNX Rewards contract{" "}
            <Link textColor={"poktLime"} textDecoration={"underline"}>
              here.
            </Link>
          </Text>
        
        </VStack>
    )
}