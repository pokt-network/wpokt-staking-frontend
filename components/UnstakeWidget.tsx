"use client"
import { useGlobalContext } from "@/context/Globals";
import {
  useStakedTokenBalance,
  useUnstakeLPToken
} from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import {
  Button,
  Center,
  Divider,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useContractWrite } from "wagmi";
import { EthIcon } from "./icons/eth";

export default function UnstakeWidget() {
  const { mobile, isClient } = useGlobalContext();
  const { address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Setting initial balances
  const [newWithdrawAmount, setNewWithdrawAmount] = useState(0);
  const { data: lpTokenStaked } = useStakedTokenBalance(userAddress as address);
  const lpTokenStakedFormatted = (userAddress && lpTokenStaked && isClient) ? formatEther(lpTokenStaked as bigint || BigInt(0)) : "0";
  const newTotalStaked = Number(lpTokenStakedFormatted) - Number(newWithdrawAmount);

  const { config } =  useUnstakeLPToken({
    amount: parseEther(Number(newWithdrawAmount).toFixed(18).toString()),
  });
  const { data, isLoading, isSuccess, write, isError } =
    useContractWrite(config);
  console.log(data, isLoading, isSuccess, isError);

  const handleWithdrawButtonClick = () => {
    console.log("Withdraw button pressed");
    write?.();
  };

  const handleAllButtonClick = () => {
    Number(lpTokenStaked) > 1e-10
      ? setNewWithdrawAmount(Number(lpTokenStakedFormatted))
      : setNewWithdrawAmount(0);
  };

  const isInvalidWithdrawAmount =
    Number(newWithdrawAmount) < 0 ||
    Number(lpTokenStakedFormatted) <= 0 ||
    Number(newWithdrawAmount) > Number(lpTokenStakedFormatted);

  const renderWithdrawButton = () => {
    if (!userAddress || !isClient) {
      return (
        <Button
          variant="outline"
          borderColor="poktLime"
          bg="transparent"
          color="white"
          leftIcon={<EthIcon fill={"white"} />}
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button>
      );
    }

    return (
      <Button
        bg="poktLime"
        onClick={handleWithdrawButtonClick}
        isDisabled={isInvalidWithdrawAmount || Number(newWithdrawAmount) === 0}
      >
        Withdraw
      </Button>
    );
  };

  const renderStakeInput = () => {
    return (
      <Center position="relative" width="60%">
        <Input
          placeholder="0.0"
          width="100%"
          color="white"
          _placeholder={{ color: "white" }}
          _focus={{ borderColor: "poktLime" }}
          _hover={{ borderColor: "poktLime" }}
          _invalid={{ borderColor: "red" }}
          borderRadius={0}
          type="number"
          value={newWithdrawAmount}
          onChange={(e) => setNewWithdrawAmount(Number(e.target.value))}
          isInvalid={isInvalidWithdrawAmount}
          min={0}
          max={Number(lpTokenStakedFormatted)}
        />
        <Button
          bg="poktLime"
          onClick={handleAllButtonClick}
          position="absolute"
          right={1}
          float="right"
          zIndex={5}
        >
          All
        </Button>
      </Center>
    );
  };

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
      <Heading>Withdraw LP tokens</Heading>
      <HStack justify="space-between" maxWidth="80%">
        <Text>Amount to Withdraw:</Text>
        {userAddress && isClient ? (
          <Text>{lpTokenStakedFormatted} LP Staked</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </HStack>
      {userAddress && isClient ? (
        renderStakeInput()
      ) : (
        <Center>{renderWithdrawButton()}</Center>
      )}

      <Divider borderColor="poktLime" marginX={20} />

      <Center flexDirection="column">
        <Text>Currently Staked</Text>
        <Text>
          {userAddress && isClient
            ? formatEther(lpTokenStaked as bigint || BigInt(0))
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>New Total Staked:</Text>
        <Text color={!isInvalidWithdrawAmount ? "white" : "red"}>
          {userAddress && isClient
            ? newWithdrawAmount < 0
              ? "Can't Input Negative number"
              : !isInvalidWithdrawAmount
              ? Number(newTotalStaked).toFixed(15)
              : `Withdrawal amount can't be greater than staked amount`
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>Estimated Gas Cost:</Text>
        <Text>0.001 Gwei</Text>
      </Center>

      <Center gap={2}>{renderWithdrawButton()}</Center>
    </VStack>
  );
}
