
import { useGlobalContext } from "@/context/Globals";
import { useLPTokenBalance, useStakeLPToken, useStakedTokenBalance } from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import { Button, Center, Divider, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useContractWrite } from "wagmi";
import { EthIcon } from "./icons/eth";

function ConnectWalletButton({ openConnectModal}:any) {
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

function ConnectStakeButton({ isInvalidStakeAmount, newStakeAmount, handleStakeButtonClick }:any) {
  return (
    <Button
      bg="poktLime"
      onClick={handleStakeButtonClick}
      isDisabled={isInvalidStakeAmount || Number(newStakeAmount) === 0}
    >
      Stake
    </Button>
  );
}

function StakeInput({ newStakeAmount, setNewStakeAmount, handleAllButtonClick, isInvalidStakeAmount, lpTokenBalance }:any) {
  // Input-related operations are separated for better readability
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
        value={newStakeAmount}
        onChange={(e) => setNewStakeAmount(Number(e.target.value))}
        isInvalid={isInvalidStakeAmount}
        min={0}
        max={lpTokenBalance?.formatted}
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
}

export default function StakingWidget() {
  const { mobile, isClient } = useGlobalContext();
  const { address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState(0);
  const { data: lpTokenBalance } = useLPTokenBalance(userAddress as address);
  const { data: lpTokenStaked } = useStakedTokenBalance(userAddress as address);

  const newTotalStaked = userAddress && lpTokenStaked && isClient
    ? Number(newStakeAmount) + ((lpTokenStaked && isClient) ? Number(formatEther(lpTokenStaked as bigint)) : 0)
    : 0;

  const { config } = useStakeLPToken({
    amount: parseEther(newStakeAmount.toString()),
  });
  const { data, isLoading, isSuccess, write, isError } = useContractWrite(config);
  console.log(data, isLoading, isSuccess, isError);

  const handleStakeButtonClick = () => {
    console.log("Stake button pressed");
    write?.();
  };

  const handleAllButtonClick = () => {
    lpTokenBalance
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
        {userAddress && isClient
          ? <Text>{lpTokenBalance?.formatted} LP Tokens in wallet</Text>
          : <Text>No wallet connected</Text>}
      </HStack>
      {userAddress && isClient
        ? <StakeInput
            newStakeAmount={newStakeAmount}
            setNewStakeAmount={setNewStakeAmount}
            handleAllButtonClick={handleAllButtonClick}
            isInvalidStakeAmount={isInvalidStakeAmount}
            lpTokenBalance={lpTokenBalance}
          />
        : <Center>
            <ConnectWalletButton openConnectModal={openConnectModal} />
          </Center>
      }

      <Divider borderColor="poktLime" marginX={20} />

      <Center flexDirection="column">
        <Text>Currently Staked</Text>
        <Text>
          {userAddress && isClient
            ? formatEther(lpTokenStaked as bigint)
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
        {userAddress && isClient ?
          <ConnectStakeButton isInvalidStakeAmount={isInvalidStakeAmount} newStakeAmount={newStakeAmount} handleStakeButtonClick={handleStakeButtonClick} />
          :
          <ConnectWalletButton openConnectModal={openConnectModal} />
        }
      </Center>
    </VStack>
  );
}
