"use client";
import { VStack, Text, Heading, HStack } from "@chakra-ui/react";
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
        <Text fontSize={16}>wPOKT to claim:</Text>
        {isClient && address ? (
          <>
            <Text fontWeight={"bold"}> 0.000000000000000000 wPOKT</Text>
            <ClaimButton />
          </>
        ) : (
          <>
            <Text fontSize={16}>No Wallet Connected</Text>
            <ConnectWalletButton />
          </>
        )}
        <VStack mt={8}>
          <Text fontWeight={"semibold"}>Rewards Breakdown</Text>
          <Text
            fontWeight={"normal"}
            maxWidth={"60%"}
          >{`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}</Text>
        </VStack>
        <VStack mt={8}>
          {address && isClient ? (
            <VStack>
              <HStack>
                <Text fontSize={16}>Your stake is worth:</Text>
                <BlueEthIcon boxSize={6}/> <Text fontSize={16}>{`180.000000`}</Text>
              </HStack>
              <Text fontSize={16}>Your 24h earnings are worth:</Text>
              <HStack>
                <BlueEthIcon boxSize={6} />
                <Text fontSize={16}>{`10.000000`}</Text>
              </HStack>
              <Text fontSize={16}>Your return per day is:</Text>
              <Text fontSize={16}>{`1%`}</Text>
            </VStack>
          ) : (
            <Text fontSize={16}>
              Connect your wallet to see estimates based on your staked balance.
            </Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
