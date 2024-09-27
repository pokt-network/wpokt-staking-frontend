"use client";

import {
  Button,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useState } from "react";
import { formatUnits } from "viem";
import { useContractWrite } from "wagmi";

import { useGlobalContext } from "@/context/Globals";
import {
  useClaimReward,
  usePendingRewardBalance,
  useRewardRate,
} from "@/utils/contract/hooks";

import { BlueDAIIcon, BlueEthIcon, PoktBlueIcon } from "../icons/eth";
import { ErrorIcon } from "../icons/misc";
import ConnectWalletButton from "../Shared/ConnectButton";

const refToken = ["ETH", "WPOKT", "DAI"];
const refIcon: Array<ReactElement> = [
  <BlueEthIcon key="eth-icon" boxSize={6} />,
  <PoktBlueIcon key="pokt-icon" boxSize={6} />,
  <BlueDAIIcon key="dai-icon" boxSize={6} />,
];
export default function RewardsWidget() {
  const { isClient, address, prices, lpTokenStaked } = useGlobalContext();

  const { data: rewardValue, isFetched } = usePendingRewardBalance(address);
  const { config, isError: notReadyToClaim, error } = useClaimReward(
    Number(rewardValue),
  );
  const { write } = useContractWrite(config);

  const [refTokenIndex, setRefTokenIndex] = useState(0);
  const refFactors = [1 / Number(prices?.eth), 1 / Number(prices?.pokt), 1];

  const { DPR, totalStakedLPTokenUSDValue, totalRewardPerDayUSDValue } =
    useRewardRate(lpTokenStaked, prices);

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
      <VStack mt={8} gap={4}>
        <Center flexDirection="column">
          <Text fontSize={14} fontWeight={400}>
            wPOKT to claim:
          </Text>
          {isClient && address ? (
            <Text fontSize={18} fontWeight={"bold"}>
              {isFetched && isClient
                ? formatUnits((rewardValue as bigint) ?? BigInt(0), 6) +
                ` wPokt`
                : `Fetching`}
            </Text>
          ) : (
            <Text fontSize={16}>No Wallet Connected</Text>
          )}
        </Center>
        <VStack>
          {isClient && address ? (
            <>
              <Button
                color="darkBlue"
                height={"52px"}
                paddingX={"53px"}
                mt={4}
                borderRadius={"30px"}
                fontSize={"16px"}
                onClick={() => write?.()}
                isDisabled={notReadyToClaim}
                bg={"poktLime"}
                fontWeight={"normal"}
                _hover={{ bg: "hover.poktLime" }}
              >
                Claim wPOKT
              </Button>
              {!!error && (
                <Text fontSize={14} color={"red"}>
                  {error.toString()}
                </Text>
              )}
            </>
          ) : (
            <ConnectWalletButton />
          )}
        </VStack>

        <VStack mt={8} maxW={"400px"}>
          <Text fontWeight={"semibold"}>Rewards Breakdown</Text>
          <HStack gap={4}>
            <ErrorIcon fill={"#F7D858"} boxSize={6} />
            <Text
              fontWeight={"normal"}
              maxWidth={"80%"}
              textAlign={"left"}
              color={"#F7D858"}
            >
              {`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}
            </Text>
          </HStack>
        </VStack>
        <VStack mt={8} maxW={"400px"} alignContent={"center"} gap={4}>
          {address && isClient ? (
            <VStack alignItems={"center"} gap={8}>
              <VStack alignItems={"center"}>
                <HStack
                  bg={"red.300"}
                  padding={0.5}
                  bgColor={"poktLime"}
                  borderRadius={4}
                  gap={1}
                  fontWeight={"normal"}
                >
                  <Button
                    padding={"4px"}
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    width={"94px"}
                    onClick={() => setRefTokenIndex(0)}
                    float="right"
                    fontWeight={"normal"}
                    zIndex={5}
                    bg={"darkBlue"}
                    color={"poktLime"}
                    _hover={{ bg: "darkBlue", color: "poktBlue" }}
                    isActive={refTokenIndex === 0}
                    _active={{ bg: "poktLime", color: "darkBlue" }}
                  >
                    {refToken[0]}
                  </Button>
                  <Button
                    padding={"4px"}
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    onClick={() => setRefTokenIndex(1)}
                    width={"94px"}
                    float="right"
                    zIndex={5}
                    fontWeight={"normal"}
                    isActive={refTokenIndex === 1}
                    bg={"darkBlue"}
                    color={"poktLime"}
                    _hover={{ bg: "darkBlue", color: "poktBlue" }}
                    _active={{ bg: "poktLime", color: "darkBlue" }}
                  >
                    {refToken[1]}
                  </Button>
                  <Button
                    padding={"4px"}
                    fontWeight={"normal"}
                    borderRadius={"4px"}
                    fontSize={"16px"}
                    onClick={() => setRefTokenIndex(2)}
                    width={"94px"}
                    float="right"
                    zIndex={5}
                    isActive={refTokenIndex === 2}
                    bg={"darkBlue"}
                    color={"poktLime"}
                    _hover={{ bg: "darkBlue", color: "poktBlue" }}
                    _active={{ bg: "poktLime", color: "darkBlue" }}
                  >
                    {refToken[2]}
                  </Button>
                </HStack>
              </VStack>

              <VStack alignItems={"center"}>
                <Text fontSize={16}>Your stake is worth:</Text>
                <HStack>
                  {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {(
                      Number(totalStakedLPTokenUSDValue) *
                      Number(refFactors[refTokenIndex])
                    ).toFixed(6)}
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
                        Number(totalRewardPerDayUSDValue) *
                        Number(refFactors[refTokenIndex])
                      ).toFixed(6)
                      : "Calculating..."}
                  </Text>
                </HStack>
              </VStack>

              <VStack alignItems={"center"}>
                <Text fontSize={16}>Your return per day is:</Text>
                <Text fontSize={16} fontWeight={"bold"} alignSelf={"center"}>
                  {DPR + `%`}
                </Text>
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
