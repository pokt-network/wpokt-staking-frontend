"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import GasEstimator from "@/components/Shared/GasEstimator";
import { useGlobalContext } from "@/context/Globals";
import {
  useApproveLPToken,
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

  const { config: stakeConfig, isError: stakeWillFail } = useStakeLPToken({
    amount: isInvalidStakeAmount
      ? BigInt("0")
      : parseEther(Number(newStakeAmount || 0).toFixed(18)) || BigInt("0"),
    isValidAmount: !isInvalidStakeAmount,
  });

  const { config: approveConfig, isError: willFail2 } = useApproveLPToken({
    amount: isInvalidStakeAmount
      ? BigInt("0")
      : parseEther(Number(newStakeAmount || 0).toFixed(18)) || BigInt("0"),
    isValidAmount: !isInvalidStakeAmount,
  });

  const contractCallConfig = stakeWillFail ? approveConfig : stakeConfig;

  const { data, isLoading, isSuccess, write, isError } = useContractWrite(
    contractCallConfig as any,
  );

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
    <VStack fontSize={16} gap={8} padding={"20px"}>
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
          isDisabled={isLoading}
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
        ) > 1e-13 && isClient ? (
          <GasEstimator
            amount={newStakeAmount}
            method={"stake"}
            willFail={stakeWillFail}
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
            willFail={stakeWillFail}
            isLoading={isLoading}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
