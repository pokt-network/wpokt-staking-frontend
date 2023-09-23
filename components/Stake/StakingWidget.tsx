"use client";
import ConnectWalletButton from "@/components/Shared/ConnectButton";
import { useGlobalContext } from "@/context/Globals";
import { useApprovalGasEstimate, useApproveLPToken, useRegularGasEstimate, useStakeLPToken } from "@/utils/contract/hooks";
import {
  Center,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useContractWrite, useFeeData } from "wagmi";
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
    txnHash,
    prices,
  } = useGlobalContext();

  const [isApproved, setIsApproved] = useState(true);

  const memoizedApprove = useMemo(() => isApproved, [isApproved]);

  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState("0");

  const { data: baseGas } = useFeeData();

  const { data: approvalGasEstimate } = useApprovalGasEstimate({ address, amount: Number(newStakeAmount) });
  const { data: stakeGasEstimate } = useRegularGasEstimate({ method: 'stake', address, amount: Number(newStakeAmount) });

  const gas = (stakeGasEstimate ?? approvalGasEstimate) as bigint;

  const formattedGas = formatEther(gas ?? baseGas?.gasPrice ?? 0);

  const newTotalStaked =
    lpTokenStaked + parseEther(newStakeAmount) || BigInt("0");

  const isInvalidStakeAmount =
  Number(newStakeAmount) < 0 || parseEther(newStakeAmount) > (lpTokenBalance ?? 0);

  const {
    config: stakeConfig,
    isError: stakeWillFail,
    isLoading: stakeLoading,
  } = useStakeLPToken({
    amount: newStakeAmount,
    isValidAmount: !isInvalidStakeAmount && memoizedApprove,
    onError: () => setIsApproved(false),
  });

  const { config: approveConfig, isLoading: approveLoading } =
    useApproveLPToken({
      amount: newStakeAmount,
      isValidAmount: !isInvalidStakeAmount && !memoizedApprove,
    });

  const contractCallConfig = !memoizedApprove ? approveConfig : stakeConfig;

  const {
    isLoading: txnLoading,
    write,
    data,
    isSuccess,
    isError,
  } = useContractWrite(contractCallConfig as any);

  const updateTxnHash = useCallback(
    () => data?.hash && setTxnHash(data?.hash),
    [data?.hash, setTxnHash],
  );

  useEffect(() => {
    updateTxnHash();
  }, [
    data?.hash,
    isSuccess,
    updateTxnHash,
    lpTokenBalance,
    lpTokenStaked,
    ethBalance,
    isApproved,
    memoizedApprove,
  ]);

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
      <Center flexDirection="column">
        <Text fontSize={14} fontWeight={400}>Amount to Stake:</Text>
        {isConnected ? (
          <Text>{formatEther(lpTokenBalance) + " LP Tokens in wallet"}</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </Center>

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
        <Text fontSize={14} fontWeight={400}>Currently Staked</Text>
        {isConnected ? (
          <Text>{formatEther(lpTokenStaked) + " LP"}</Text>
        ) : (
          <Text>No wallet connected</Text>
        )}
      </Center>
      <Center flexDirection="column">
        <Text fontSize={14} fontWeight={400}>New Total Staked:</Text>
        <Text color={!isInvalidStakeAmount ? "white" : "red"}>
          {stakeText()}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text fontSize={14} fontWeight={400}>Estimated Gas Cost:</Text>
        {isConnected ? (
          <Text
            color={formatEther(ethBalance) < formattedGas ? "red" : "white"}
          >
            {formatEther(ethBalance) < formatEther(0 || BigInt(0))
              ? "Not Enough ETH available for Gas"
              : formattedGas +
              " ETH (~" +
              ((Number(prices.eth) * Number(formattedGas)).toFixed(8) +
                " USD)")}
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
            approved={memoizedApprove}
            isLoading={
              stakeLoading ||
              approveLoading ||
              (txnLoading && !txnHash && !isSuccess)
            }
          />
        ) : (
          <ConnectWalletButton />
        )}
      </Center>
    </VStack>
  );
}
