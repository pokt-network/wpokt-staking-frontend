"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import GasEstimator from "@/components/Shared/GasEstimator";
import {
  useStakedTokenBalance,
  useUnstakeLPToken,
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
import WithDrawButton from "./Components/Button";
import WithdrawInput from "./Components/Input";

export default function UnstakeWidget() {
  const { mobile, isClient } = useGlobalContext();
  const { address: userAddress } = useAccount();

  const [newWithdrawAmount, setNewWithdrawAmount] = useState(0);
  const { data: lpTokenStaked } = useStakedTokenBalance(userAddress as address);
  const lpTokenStakedFormatted =
    userAddress && lpTokenStaked && isClient
      ? formatEther((lpTokenStaked as bigint) || BigInt(0))
      : "0";
  const newTotalStaked =
    Number(lpTokenStakedFormatted) - Number(newWithdrawAmount);

  const isInvalidWithdrawAmount =
    Number(newWithdrawAmount) < 0 ||
    Number(newWithdrawAmount) > Number(lpTokenStakedFormatted);

  const { config, isError: willFail } = useUnstakeLPToken({
    amount:
      parseEther(Number(newWithdrawAmount).toFixed(18).toString()) || BigInt(0),
    isValidAmount: !isInvalidWithdrawAmount,
  });

  const { data, isLoading, isSuccess, write, isError } =
    useContractWrite(config);

  console.log(data, isLoading, isSuccess, isError);

  const handleWithdrawButtonClick = () => {
    write?.();
  };

  const handleAllButtonClick = () => {
    Number(lpTokenStakedFormatted) > 1e-8
      ? setNewWithdrawAmount(Number(lpTokenStakedFormatted))
      : setNewWithdrawAmount(0);
  };

  return (
    <VStack fontSize={16} gap={8} padding={"20px"}>
      <Heading>Withdraw LP tokens</Heading>
      <HStack justify="space-between">
        <Text>Amount to Withdraw:</Text>
        {userAddress && isClient ? (
          <Text>{lpTokenStakedFormatted} LP Staked</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </HStack>
      {userAddress && isClient ? (
        <WithdrawInput
          newWithdrawAmount={newWithdrawAmount}
          setNewWithdrawAmount={setNewWithdrawAmount}
          handleAllButtonClick={handleAllButtonClick}
          isInvalidWithdrawAmount={isInvalidWithdrawAmount}
          lpTokenStakedFormatted={lpTokenStakedFormatted}
          willFail={willFail}
        />
      ) : (
        <Center>
          <ConnectWalletButton />
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
        {Number(formatEther((lpTokenStaked as bigint) || BigInt(0))) > 1e-13 ? (
          <GasEstimator
            amount={newWithdrawAmount}
            method={"withdraw"}
            willFail={willFail}
            isInvalidAmount={isInvalidWithdrawAmount}
          />
        ) : userAddress ? (
          <Text color={"red"}>{`You don't have enough LP Tokens staked`}</Text>
        ) : (
          "No wallet connected"
        )}
      </Center>

      <Center gap={2}>
        {userAddress && isClient ? (
          <WithDrawButton
            isInvalidWithdrawAmount={isInvalidWithdrawAmount}
            newWithdrawAmount={newWithdrawAmount}
            handleWithdrawButtonClick={handleWithdrawButtonClick}
            willFail={willFail}
            isDisabled={isLoading}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
