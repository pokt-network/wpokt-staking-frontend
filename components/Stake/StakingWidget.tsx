"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import {
  useLPTokenBalance,
  useStakeLPToken,
  useStakedTokenBalance,
} from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import {
  Center,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useContractWrite } from "wagmi";
import StakeButton from "./Components/Button";
import StakeInput from "./Components/Input";

export default function StakingWidget() {
  const { mobile, isClient } = useGlobalContext();
  const { address: userAddress } = useAccount();
  

  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState(0);
  const { data: lpTokenBalance } =
    useLPTokenBalance(userAddress as address) || BigInt(0);
  const { data: lpTokenStaked } =
    useStakedTokenBalance(userAddress as address) || BigInt(0);

  const newTotalStaked =
    userAddress && lpTokenStaked && isClient
      ? Number(newStakeAmount) +
        (lpTokenStaked && isClient
          ? Number(formatEther(lpTokenStaked as unknown as bigint))
          : 0)
      : 0;

  const { config } = useStakeLPToken({
    amount: parseEther(newStakeAmount.toString()),
  });
  const { data, isLoading, isSuccess, write, isError } =
    useContractWrite(config);
  console.log(data, isLoading, isSuccess, isError);

  const handleStakeButtonClick = () => {
    console.log("Stake button pressed");
    write?.();
  };

  const handleAllButtonClick = () => {
    Number(lpTokenBalance?.formatted) > 1e-10
      ? setNewStakeAmount(Number(lpTokenBalance?.formatted))
      : setNewStakeAmount(0);
  };

  const isInvalidStakeAmount =
    Number(newStakeAmount) < 0 ||
    Number(newTotalStaked) < 0 ||
    Number(newStakeAmount) > Number(lpTokenBalance?.formatted);

  return (
    <VStack
      flexDirection="column"
      justify="center"
      align="center"
      fontSize={16}
      gap={8}
      textAlign="center"
      flexGrow={1}
      mx={!mobile ? "20%" : "0%"}
      px={10}
      py={10}
    >
      <Heading>Stake LP tokens</Heading>
      <HStack justify="space-between" maxWidth="80%">
        <Text>Amount to Stake:</Text>
        {userAddress && isClient ? (
          <Text>{lpTokenBalance?.formatted} LP Tokens in wallet</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </HStack>
      {userAddress && isClient ? (
        <StakeInput
          newStakeAmount={newStakeAmount}
          setNewStakeAmount={setNewStakeAmount}
          handleAllButtonClick={handleAllButtonClick}
          isInvalidStakeAmount={isInvalidStakeAmount}
          lpTokenBalance={lpTokenBalance}
        />
      ) : (
        <Center>
          <ConnectWalletButton/>
        </Center>
      )}

      <Divider borderColor="poktLime" marginX={20} />

      <Center flexDirection="column">
        <Text>Currently Staked</Text>
        <Text>
          {userAddress && isClient
            ? formatEther((lpTokenStaked as bigint) || BigInt(0))
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>New Total Staked:</Text>
        <Text color={!isInvalidStakeAmount ? "white" : "red"}>
          {userAddress && isClient
            ? newStakeAmount < 0
              ? "Can't Input Negative number"
              : !isInvalidStakeAmount
              ? Number(newTotalStaked).toFixed(18)
              : "Not Enough LP tokens in Wallet!"
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>Estimated Gas Cost:</Text>
        <Text>0.001 Gwei</Text>
      </Center>

      <Center gap={2}>
        {userAddress && isClient ? (
          <StakeButton
            isInvalidStakeAmount={isInvalidStakeAmount}
            newStakeAmount={newStakeAmount}
            handleStakeButtonClick={handleStakeButtonClick}
          />
        ) : (
          <ConnectWalletButton/>
        )}
      </Center>
    </VStack>
  );
}
