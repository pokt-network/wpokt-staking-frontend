"use client";
import { HStack, Text, Heading, VStack } from "@chakra-ui/react";
import { useGlobalContext } from "@/context/Globals";
import { useAccount } from "wagmi";
import ConnectWalletButton from "../Shared/ConnectButton";
import ClaimButton from "./Components/ClaimButton";
import { BlueEthIcon } from "../icons/eth";
export default function RewardsWidget() {
  const { isClient } = useGlobalContext();
  const { address } = useAccount();
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
      <VStack mt={8}>
        <Text fontSize={14}>wPOKT to claim:</Text>
        {isClient && address ? (
          <>
            <Text fontWeight={"bold"} fontSize={16}> 0.000000000000000000 wPOKT</Text>
            <ClaimButton />
          </>
        ) : (
          <>
            <Text fontSize={16}>No Wallet Connected</Text>
            <ConnectWalletButton />
          </>
        )}
        <VStack mt={8} maxW={"400px"}>
          <Text fontWeight={"semibold"}>Rewards Breakdown</Text>
          <Text
            fontWeight={"normal"}
            maxWidth={"80%"}
            textAlign={"left"}
          >{`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}</Text>
        </VStack>
        <VStack mt={8} maxW={"400px"} alignContent={'flex-start'}>
          {address && isClient ? (
            <VStack alignItems={"flex-start"}>
              <VStack alignItems={"flex-start"}>
                      <Text fontSize={16}>Your stake is worth:</Text>
                      <HStack>
                        <BlueEthIcon boxSize={6} />{" "}
                        <Text fontSize={16} fontWeight={"bold"}>{`180.000000`}</Text>
                      </HStack>
              </VStack>
              <Text fontSize={16}>Your 24h earnings are worth:</Text>
              <VStack alignItems={"flex-start"}>
                <HStack>
                  <BlueEthIcon boxSize={6} />
                  <Text fontSize={16} fontWeight={"bold"}>{`10.000000`}</Text>
                </HStack>
              </VStack>
              <VStack>
                <Text fontSize={16}>Your return per day is:</Text>
                <Text
                  fontSize={16}
                  fontWeight={"bold"}
                  alignSelf={"center"}
                >{`1%`}</Text>
              </VStack>
            </VStack>
          ) : (
            <Text fontSize={16} textAlign={'left'} maxWidth={"80%"} >
              Connect your wallet to see estimates based on your staked balance.
            </Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
