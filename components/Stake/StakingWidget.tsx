"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import GasEstimator from "@/components/Shared/GasEstimator";
import {
  useGasEstimate,
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
import { useEffect, useState } from "react";
import { formatEther, parseEther, parseGwei } from "viem";
import { useAccount, useContractWrite } from "wagmi";
import StakeButton from "./Components/Button";
import StakeInput from "./Components/Input";

export default function StakingWidget() {
  const { mobile, isClient } = useGlobalContext();
  const { address: userAddress } = useAccount();
  const [gas, setGas] = useState("");

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
          ? Number(
              formatEther((lpTokenStaked as unknown as bigint) || BigInt(0)),
            )
          : 0)
      : 0;

  const isInvalidStakeAmount =
    Number(newStakeAmount) < 0 ||
    Number(newTotalStaked) < 0 ||
    Number(newStakeAmount) > Number(lpTokenBalance?.formatted);

  const { config, isError: willFail } = useStakeLPToken({
    amount: isInvalidStakeAmount
      ? BigInt("0")
      : parseEther(Number(newStakeAmount || 0).toFixed(18)) || BigInt("0"),
    isValidAmount: !isInvalidStakeAmount,
  });
  const { data, isLoading, isSuccess, write, isError } =
    useContractWrite(config);

  console.log(data, isLoading, isSuccess, isError);

  const handleStakeButtonClick = () => {
    write?.();
  };

  const handleAllButtonClick = () => {
    Number(lpTokenBalance?.formatted) >= 1e-13
      ? setNewStakeAmount(
          Number(lpTokenBalance?.formatted).toFixed(18) as unknown as number,
        )
      : setNewStakeAmount(0);
  };

  console.log(newStakeAmount);

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
          <Text>
            {formatEther(
              (lpTokenBalance?.value as unknown as bigint) || BigInt(0),
            )}{" "}
            LP Tokens in wallet
          </Text>
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
          <ConnectWalletButton />
        </Center>
      )}

      <Divider borderColor="poktLime" marginX={20} />

      <Center flexDirection="column">
        <Text>Currently Staked</Text>
        <Text>
          {userAddress && isClient
            ? Number(
                formatEther((lpTokenStaked as bigint) || BigInt(0)),
              ).toFixed(18)
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
        {Number(
          formatEther(
            (lpTokenBalance?.value as unknown as bigint) || BigInt(0),
          ),
        ) > 1e-13 ? (
          <GasEstimator
            amount={newStakeAmount}
            method={"stake"}
            willFail={willFail}
            isInvalidAmount={isInvalidStakeAmount}
          />
        ) : userAddress ? (
          <Text
            color={"red"}
          >{`You don't have enough LP Tokens in wallet.`}</Text>
        ) : (
          "No wallet connected"
        )}
      </Center>

      <Center gap={2}>
        {userAddress && isClient ? (
          <StakeButton
            isInvalidStakeAmount={isInvalidStakeAmount}
            newStakeAmount={newStakeAmount}
            handleStakeButtonClick={handleStakeButtonClick}
            willFail={willFail}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
