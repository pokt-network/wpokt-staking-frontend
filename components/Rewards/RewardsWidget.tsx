"use client";

import {
  HStack,
  Text,
  Heading,
  VStack,
  Button,
  Switch,
} from "@chakra-ui/react";
import { useGlobalContext } from "@/context/Globals";
import { useAccount, useContractWrite } from "wagmi";
import ConnectWalletButton from "../Shared/ConnectButton";
import {
  BlueDAIIcon,
  BlueEthIcon,
  PoktBlueIcon,
  SwitchIcon,
} from "../icons/eth";
import {
  useClaimReward,
  usePendingRewardBalance,
} from "@/utils/contract/hooks";
import { address } from "../../utils/types";
import { formatEther } from "viem";
import { ReactElement, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const refToken = ["ETH", "WPOKT", "DAI"];
const refIcon: Array<ReactElement> = [
  <BlueEthIcon key="eth-icon" boxSize={6} />,
  <PoktBlueIcon key="pokt-icon" boxSize={6} />,
  <BlueDAIIcon key="dai-icon" boxSize={6} />,
];
export default function RewardsWidget() {
  const { isClient, address, prices } = useGlobalContext();

  const {
    data: rewardValue,
    isError,
    isFetched,
  } = usePendingRewardBalance(address as address);
  const {
    config,
    isError: notReadyToClaim,
    isFetched: readyToClaim,
  } = useClaimReward(Number(rewardValue));
  const { write } = useContractWrite(config);

  const [refTokenIndex, setRefTokenIndex] = useState(0);
  const refFactors = [prices?.eth, 1, prices?.pokt];

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
            <Text fontSize={16} fontWeight={"bold"}>
              {isFetched && isClient
                ? formatEther(rewardValue as bigint) + ` wPokt`
                : `Fetching`}
            </Text>
            <Button
              height={"52px"}
              borderRadius={"12px"}
              fontSize={"16px"}
              onClick={() => write?.()}
              isDisabled={notReadyToClaim}
              bg={"poktLime"}
            >
              Claim wPOKT
            </Button>
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
            textAlign={"center"}
          >{`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}</Text>
        </VStack>
        <VStack mt={8} maxW={"400px"} alignContent={"center"} gap={4}>
          {address && isClient ? (
            <VStack alignItems={"center"} gap={8}>
              <VStack alignItems={"center"}>
                <Button
                  paddingX={"32px"}
                  paddingY={"16px"}
                  borderRadius={"12px"}
                  fontSize={"16px"}
                  onClick={() => setRefTokenIndex((refTokenIndex + 1) % 3)}
                  right={3}
                  float="right"
                  zIndex={5}
                  bg={"poktLime"}
                  leftIcon={<SwitchIcon boxSize={"21px"} />}
                  m={8}
                >
                  {refToken[refTokenIndex]}
                </Button>
                <Text fontSize={16}>Your stake is worth:</Text>
                <HStack>
                  {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {isFetched && isClient
                      ? (
                          Number(formatEther(rewardValue as bigint)) *
                          Number(refFactors[refTokenIndex])
                        ).toFixed(18)
                      : "Calculating..."}
                  </Text>
                </HStack>
              </VStack>

              <VStack alignItems={"center"}>
                <Text fontSize={16}>Your 24h earnings are worth:</Text>
                <HStack>
                  {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {isFetched && isClient
                      ? (
                          Number(formatEther(rewardValue as bigint)) *
                          Number(refFactors[refTokenIndex])
                        ).toFixed(18)
                      : "Calculating..."}
                  </Text>
                </HStack>
              </VStack>

              <VStack alignItems={"center"}>
                <Text fontSize={16}>Your return per day is:</Text>
                <Text
                  fontSize={16}
                  fontWeight={"bold"}
                  alignSelf={"center"}
                >{`1%`}</Text>
              </VStack>
            </VStack>
          ) : (
            <Text fontSize={16} textAlign={"left"} maxWidth={"80%"}>
              Connect your wallet to see estimates based on your staked balance.
            </Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
