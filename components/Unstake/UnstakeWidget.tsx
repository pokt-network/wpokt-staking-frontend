"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import { useUnstakeLPToken } from "@/utils/contract/hooks";
import {
  Center,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useContractWrite, useFeeData } from "wagmi";
import WithDrawButton from "./Components/Button";
import WithdrawInput from "./Components/Input";

export default function UnstakeWidget() {
  const {
    isClient,
    lpTokenStaked,
    ethBalance,
    setTxnHash,
    txnHash,
    isConnected,
  } = useGlobalContext();

  const [newWithdrawAmount, setNewWithdrawAmount] = useState("0");

  const { data: gas } = useFeeData();

  const newTotalStaked =
    lpTokenStaked - parseEther(newWithdrawAmount) || BigInt("0");

  const isInvalidWithdrawAmount =
    parseEther(newWithdrawAmount) > lpTokenStaked ||
    Number(newWithdrawAmount) < 0 ||
    newTotalStaked < 0;

  const {
    config,
    isError: willFail,
    isLoading: unStakeLoading,
  } = useUnstakeLPToken({
    amount: newWithdrawAmount,
    isValidAmount: !isInvalidWithdrawAmount,
  });

  const {
    data,
    isLoading: txnLoading,

    isSuccess,
    write,
    isError,
  } = useContractWrite(config);

  const updateTxnHash = useCallback(
    () => data?.hash && setTxnHash(data?.hash),
    [data?.hash, setTxnHash],
  );

  useEffect(() => {
    if (data?.hash && isSuccess) updateTxnHash();
  }, [data?.hash, isSuccess, updateTxnHash]);

  const handleWithdrawButtonClick = () => {
    write?.();
  };

  const handleAllButtonClick = () => {
    setNewWithdrawAmount(formatEther(lpTokenStaked));
  };

  const withdrawText = () => {
    if (isConnected) {
      if (!isInvalidWithdrawAmount) {
        return formatEther(newTotalStaked) + " LP";
      } else {
        if (Number(newWithdrawAmount) < 0) {
          return "Can't Input Negative number";
        } else {
          return `Withdrawal amount can't be greater than staked amount`;
        }
      }
    } else {
      return "No wallet connected";
    }
  };

  return (
    <VStack fontSize={16} gap={8} padding={"20px"}>
      <Heading>Withdraw LP tokens</Heading>
      <HStack justify="space-between">
        <Text>Amount to Withdraw:</Text>
        {isConnected ? (
          <Text>{formatEther(lpTokenStaked)} LP Staked</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </HStack>
      {isConnected ? (
        <WithdrawInput
          newWithdrawAmount={newWithdrawAmount}
          setNewWithdrawAmount={setNewWithdrawAmount}
          handleAllButtonClick={handleAllButtonClick}
          isInvalidWithdrawAmount={isInvalidWithdrawAmount}
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
        {isConnected ? (
          <Text>{formatEther(lpTokenStaked)} LP</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </Center>
      <Center flexDirection="column">
        <Text>New Total Staked:</Text>
        <Text color={!isInvalidWithdrawAmount ? "white" : "red"}>
          {withdrawText()}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>Estimated Gas Cost:</Text>
        {isConnected ? (
          <Text
            color={
              formatEther(ethBalance) < formatEther(gas?.gasPrice || BigInt(0))
                ? "red"
                : "white"
            }
          >
            {formatEther(ethBalance) < formatEther(0 || BigInt(0))
              ? "Not Enough ETH available for Gas"
              : formatEther(gas?.gasPrice || BigInt("0")) + " ETH"}
          </Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </Center>

      <Center gap={2}>
        {isConnected ? (
          <WithDrawButton
            isInvalidWithdrawAmount={isInvalidWithdrawAmount}
            handleWithdrawButtonClick={handleWithdrawButtonClick}
            isLoading={unStakeLoading || (txnLoading && !txnHash && !isSuccess)}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
