"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import { useApproveLPToken, useStakeLPToken } from "@/utils/contract/hooks";
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
  const { isClient, lpTokenBalance, lpTokenStaked, gasEstimates, ethBalance } =
    useGlobalContext();

  const { address: userAddress } = useAccount();

  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState("0");

  const newTotalStaked =
    lpTokenStaked + parseEther(newStakeAmount) || BigInt("0");

  const isInvalidStakeAmount =
    Number(newStakeAmount) < 0 || parseEther(newStakeAmount) > lpTokenBalance;

  const { config: stakeConfig, isError: stakeWillFail } = useStakeLPToken({
    amount: newStakeAmount,
    isValidAmount: !isInvalidStakeAmount,
  });

  const { config: approveConfig } = useApproveLPToken({
    amount: newStakeAmount,
    isValidAmount: !isInvalidStakeAmount,
  });

  const contractCallConfig = stakeWillFail ? approveConfig : stakeConfig;

  const { isLoading, write } = useContractWrite(contractCallConfig as any);

  const handleStakeButtonClick = () => {
    write?.();
  };

  const handleAllButtonClick = () => {
    setNewStakeAmount(formatEther(lpTokenBalance));
  };

  const stakeText = () => {
    if (userAddress && isClient) {
      if (Number(newStakeAmount) < 0) return "Can't Input Negative number";
      else if (!isInvalidStakeAmount)
        return formatEther(newTotalStaked) + " LP";
      else return "Not Enough LP tokens in Wallet!";
    } else return "No wallet connected";
  };
  return (
    <VStack fontSize={16} gap={8} padding={"20px"}>
      <Heading>Stake LP tokens</Heading>
      <HStack justify="space-between" maxWidth="80%">
        <Text>Amount to Stake:</Text>
        {userAddress && isClient ? (
          <Text>{formatEther(lpTokenBalance) + " LP Tokens in wallet"}</Text>
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
        {userAddress && isClient ? (
          <Text>{formatEther(lpTokenStaked) + " LP"}</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </Center>
      <Center flexDirection="column">
        <Text>New Total Staked:</Text>
        <Text color={!isInvalidStakeAmount ? "white" : "red"}>
          {stakeText()}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>Estimated Gas Cost:</Text>
        {userAddress && isClient ? (
          <Text
            color={
              formatEther(ethBalance) <
              formatEther(gasEstimates[0] + gasEstimates[1] || BigInt(0))
                ? "red"
                : "white"
            }
          >
            {formatEther(ethBalance) <
            formatEther(gasEstimates[0] + gasEstimates[1] || BigInt(0))
              ? "Not Enough ETH available for Gas"
              : formatEther(gasEstimates[0] + gasEstimates[1] || BigInt("0"))}
          </Text>
        ) : (
          <Text>No wallet connected</Text>
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
