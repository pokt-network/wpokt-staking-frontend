"use client";
import useSWR from "swr";
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
import { BlueDAIIcon, BlueEthIcon, PoktBlueIcon, SwitchIcon } from "../icons/eth";
import {
  useClaimReward,
  usePendingRewardBalance,
} from "@/utils/contract/hooks";
import { address } from "../../utils/contract/types";
import { formatEther } from "viem";
import { ReactElement, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const refToken = ["ETHUSDC", "USDCUSDT", "ETHBTC"];
const refIcon: Array<ReactElement> = [
  <BlueEthIcon key="eth-icon" boxSize={6} />,
  <BlueDAIIcon key="dai-icon" boxSize={6} />,
  <PoktBlueIcon key="pokt-icon" boxSize={6} />,
];
export default function RewardsWidget() {
  const { isClient } = useGlobalContext();
  const { address } = useAccount();

  const {
    data: rewardValue,
    isError,
    isFetched,
  } = usePendingRewardBalance(address as address);
  const {
    config,
    isError: notReadyToClaim,
    isFetched: readToClaim,
  } = useClaimReward(Number(rewardValue));
  const { write } = useContractWrite(config);

  const [refTokenIndex, setRefTokenIndex] = useState(0);

  const { data, error, isLoading } = useSWR(
    "https://api.binance.us/api/v3/ticker/price?symbol=" +
      refToken[refTokenIndex],
    fetcher,
  );

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
            textAlign={"left"}
          >{`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}</Text>
        </VStack>
        <VStack mt={8} maxW={"400px"} alignContent={"flex-start"}>
          {address && isClient ? (
            <VStack alignItems={"flex-start"}>
              <VStack alignItems={"flex-start"}>
                <Button
                  paddingX={"32px"}
                  paddingY={"16px"}
                  borderRadius={"12px"}
                  fontSize={"16px"}
                  onClick={() => setRefTokenIndex((refTokenIndex + 1) % 3)}
                  right={3}
                  float="right"
                  zIndex={5}
                  isDisabled={isLoading}
                  bg={"poktLime"}
                  leftIcon={<SwitchIcon boxSize={"21px"} />}
                >
                  {refToken[refTokenIndex].substring(3, 7)}
                </Button>
                <Text fontSize={16}>Your stake is worth:</Text>
                <HStack>
                  {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {isFetched && isClient && data
                      ? (
                          Number(formatEther(rewardValue as bigint)) *
                          Number(data?.price as unknown as string)
                        ).toFixed(18)
                      : "Calculating..."}
                  </Text>
                </HStack>
              </VStack>
              <Text fontSize={16}>Your 24h earnings are worth:</Text>
              <VStack alignItems={"flex-start"}>
                <HStack>
                {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {isFetched && isClient && data
                      ? (
                          Number(formatEther(rewardValue as bigint)) *
                          Number(data?.price as unknown as string)
                        ).toFixed(18)
                      : "Calculating..."}
                  </Text>
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
            <Text fontSize={16} textAlign={"left"} maxWidth={"80%"}>
              Connect your wallet to see estimates based on your staked balance.
            </Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
}
