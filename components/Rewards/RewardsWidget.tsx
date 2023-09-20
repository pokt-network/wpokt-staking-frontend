"use client";

import {
  HStack,
  Text,
  Heading,
  VStack,
  Button,
  Switch,
  ButtonGroup,
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
import { ErrorIcon } from "../icons/misc";

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
  const refFactors = [(Number(prices?.pokt) / Number(prices?.eth)), 1, prices?.pokt];

  console.log(prices)

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
        <Text fontSize={14}>wPOKT to claim:</Text>
        {isClient && address ? (
          <>
            <Text fontSize={16} fontWeight={"bold"}>
              {isFetched && isClient
                ? formatEther(rewardValue as bigint ?? BigInt(0)) + ` wPokt`
                : `Fetching`}
            </Text>
            <Button
              height={"52px"}
              borderRadius={"4px"}
              fontSize={"16px"}
              onClick={() => write?.()}
              isDisabled={notReadyToClaim}
              bg={"poktLime"}
              fontWeight={'normal'}
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
          <HStack gap={4}>
          <ErrorIcon fill={'#F7D858'} boxSize={6}/>
          <Text
            fontWeight={"normal"}
            maxWidth={"80%"}
            textAlign={"left"}
            color={'#F7D858'}
          >
            
            {`All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`}</Text>
          </HStack>
        </VStack>
        <VStack mt={8} maxW={"400px"} alignContent={"center"} gap={4}>
          {address && isClient ? (
            <VStack alignItems={"center"} gap={8}>
              <VStack alignItems={"center"}>
              <HStack bg={'red.300'} padding={1} bgColor={'poktLime'} borderRadius={4} gap={1} fontWeight={'normal'}>
                <Button
                  padding={'4px'}
                  borderRadius={'4px'}
                  fontSize={"16px"}
                  width={'94px'}
                  onClick={() => setRefTokenIndex(0)}
                  float="right"
                  fontWeight={'normal'}
                  zIndex={5}
                  bg={'#172229'}
                  color={'poktLime'}
                  _hover={{bg: '#172229', color: 'poktLime'}}
                  isActive={refTokenIndex === 0 }
                  _active={{bg: 'poktLime', color: '#172229'}}
                >
                  {refToken[0]}
                </Button>
                <Button
                  padding={'4px'}
                  borderRadius={'4px'}
                  fontSize={"16px"}
                  onClick={() => setRefTokenIndex(1)}
                  width={'94px'}
                  float="right"
                  zIndex={5}
                  fontWeight={'normal'}
                  isActive={refTokenIndex ===1 }
                  bg={'#172229'}
                  color={'poktLime'}
                  _hover={{bg: '#172229', color: 'poktLime'}}
                  _active={{bg: 'poktLime', color: '#172229'}}
                >
                  {refToken[1]}
                </Button>
                <Button
                  padding={'4px'}
                  fontWeight={'normal'}
                  borderRadius={'4px'}
                  fontSize={"16px"}
                  onClick={() => setRefTokenIndex(2)}
                  width={'94px'}
                  float="right"
                  zIndex={5}
                  isActive={refTokenIndex === 2 }
                  bg={'#172229'}
                  color={'poktLime'}
                  _hover={{bg: '#172229', color: 'poktLime'}}
                  _active={{bg: 'poktLime', color: '#172229'}}
                  
                >
                  {refToken[2]}
                </Button>
                </HStack>
                <Text fontSize={16}>Your stake is worth:</Text>
                <HStack>
                  {refIcon[refTokenIndex]}
                  <Text fontSize={16} fontWeight={"bold"}>
                    {isFetched && isClient
                      ? (
                        Number(formatEther(rewardValue as bigint ?? BigInt(0))) *
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
                        Number(formatEther(rewardValue as bigint ?? BigInt(0))) *
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
