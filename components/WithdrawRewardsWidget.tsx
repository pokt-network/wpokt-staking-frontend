"use client"
import { VStack, Text, Heading } from "@chakra-ui/react";
import { useGlobalContext } from "@/context/Globals";
import { useAccount } from "wagmi";
export default function WithdrawRewardsWidget() {
  const {isClient} = useGlobalContext();
  const {address} = useAccount();
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
      <Heading>wPOKT Rewards</Heading>
      <VStack>
      <Text>wPOKT to claim:</Text>
      {isClient && address ? 
      <Text fontWeight={"bold"}> 0.000000000000000000 wPOKT</Text>
      
       :<Text>No Wallet Connected</Text>
       }
      </VStack>
    </VStack>
  );
}
