"use client"
import { Link } from "@chakra-ui/next-js"
import { VStack, Text } from "@chakra-ui/react"
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
            <Link href={"/"}>
            <Text textColor={"poktLime"} textDecoration={"underline"}>

              here.
              </Text>
            </Link>
          </Text>
          <Text>
            Farming uses this SNX Rewards contract{" "}
            <Link href={"/"}>
            <Text textColor={"poktLime"} textDecoration={"underline"}>
              here.
              </Text>
            </Link>
          </Text>
        
        </VStack>
    )
}