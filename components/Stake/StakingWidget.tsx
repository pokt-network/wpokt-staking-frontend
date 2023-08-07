"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import {
  ApprovalGasEstimate,
  GasEstimate,
  useApproveLPToken,
  useStakeLPToken,
} from "@/utils/contract/hooks";
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
import { useAccount, useContractWrite, useFeeData } from "wagmi";
import StakeButton from "./Components/Button";
import StakeInput from "./Components/Input";

export default function StakingWidget() {
  const {
    isClient,
    lpTokenBalance,
    lpTokenStaked,
    isConnected,
    ethBalance,
    setTxnHash,
    address,
  } = useGlobalContext();

  const [isApproved, setIsApproved] = useState(true);
  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState("0");

  const { data: gas } = useFeeData();

  const newTotalStaked =
    lpTokenStaked + parseEther(newStakeAmount) || BigInt("0");

  const isInvalidStakeAmount =
    Number(newStakeAmount) < 0 || parseEther(newStakeAmount) > lpTokenBalance;

  const {
    config: stakeConfig,
    isError: stakeWillFail,
    isLoading: stakeLoading,
  } = useStakeLPToken({
    amount: newStakeAmount,
    isValidAmount: !isInvalidStakeAmount && isApproved,
  });

  if (stakeWillFail) () => setIsApproved(false);

  const { config: approveConfig, isLoading: approveLoading } =
    useApproveLPToken({
      amount: newStakeAmount,
      isValidAmount: !isInvalidStakeAmount && !isApproved,
    });

  const contractCallConfig = !isApproved ? approveConfig : stakeConfig;

  const {
    isLoading: txnLoading,
    write,
    data,
    isSuccess,
    isError,
  } = useContractWrite(contractCallConfig as any);

  const updateTxnHash = useCallback(
    () => data?.hash && setTxnHash(data?.hash),
    [data?.hash, setTxnHash]
  );

  useEffect(() => {
    if (data?.hash && isSuccess) updateTxnHash();
  }, [data?.hash, isSuccess, updateTxnHash]);

  const handleStakeButtonClick = () => {
    write?.();
  };

  const handleAllButtonClick = () => {
    setNewStakeAmount(formatEther(lpTokenBalance));
  };

  const stakeText = () => {
    if (isConnected) {
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
        {isConnected ? (
          <Text>{formatEther(lpTokenBalance) + " LP Tokens in wallet"}</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </HStack>
      {isConnected ? (
        <StakeInput
          newStakeAmount={newStakeAmount}
          setNewStakeAmount={setNewStakeAmount}
          handleAllButtonClick={handleAllButtonClick}
          isInvalidStakeAmount={isInvalidStakeAmount}
          isDisabled={approveLoading || stakeLoading || txnLoading}
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
          <StakeButton
            isInvalidStakeAmount={isInvalidStakeAmount}
            newStakeAmount={newStakeAmount}
            handleStakeButtonClick={handleStakeButtonClick}
            willFail={stakeWillFail}
            isLoading={
              stakeLoading || approveLoading || txnLoading || data?.hash
            }
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
