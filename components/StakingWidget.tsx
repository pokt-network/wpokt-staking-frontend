import { use, useEffect, useState } from "react";
import { useContractWrite, useAccount } from "wagmi";
import { formatEther, formatUnits, parseEther } from "viem";
import {
  useLPTokenBalance,
  useStakedTokenBalance,
  useStakeLPToken,
} from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import { useGlobalContext } from "@/context/Globals";
import { useConnectModal } from "@rainbow-me/rainbowkit";
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
import { EthIcon } from "./icons/eth";

export default function StakingWidget() {
  const { mobile } = useGlobalContext();
  const { address: userAddress } = useAccount();
  const { openConnectModal } = useConnectModal();



  // Setting initial balances
  const [newStakeAmount, setNewStakeAmount] = useState(0);
  const { data: lpTokenBalance} = useLPTokenBalance(userAddress as address);
  const { data: lpTokenStaked } =   useStakedTokenBalance(userAddress as address);
  const newTotalStaked =  lpTokenStaked ? Number(newStakeAmount) + Number(formatEther(lpTokenStaked as any)) : 0;
  

  
  
  

  const { config } = useStakeLPToken({amount: parseEther(newStakeAmount.toString())});
  const { data, isLoading, isSuccess, write, isError } = useContractWrite(config);
  console.log(data, isLoading, isSuccess, isError);

  const handleStakeButtonClick = () => {
    console.log("Stake button pressed");
    write?.();
  };

  const handleAllButtonClick = () => {
    lpTokenBalance ? setNewStakeAmount(Number(lpTokenBalance?.formatted)) : setNewStakeAmount(0);
  };

  const isInvalidStakeAmount =
    Number(newStakeAmount) < 0 ||
    Number(newTotalStaked) < 0 ||
    Number(newStakeAmount) > Number(lpTokenBalance?.formatted);

  const renderStakeButton = () => {
    if (!userAddress) {
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
        onClick={handleStakeButtonClick}
        isDisabled={isInvalidStakeAmount || Number(newStakeAmount) === 0}
      >
        Stake
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
      <Heading>Stake LP tokens</Heading>
      <HStack justify="space-between" maxWidth="80%">
        <Text>Amount to Stake:</Text>
        {!userAddress ? (
          <Text>No wallet connected</Text>
        ) : (
          <Text>{lpTokenBalance?.formatted} LP Tokens in wallet</Text>
        )}
      </HStack>
      {userAddress ? (
        renderStakeInput()
      ) : (
        <Center>{renderStakeButton()}</Center>
      )}

      <Divider borderColor="poktLime" marginX={20} />

      <Center flexDirection="column">
        <Text>Currently Staked</Text>
        <Text>
          {userAddress
            ? (formatUnits(lpTokenStaked as unknown as bigint, 18) as string)
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>New Total Staked:</Text>
        <Text color={!isInvalidStakeAmount ? "white" : "red"}>
          {userAddress
            ? newStakeAmount < 0
              ? "Can't Input Negative number"
              : !isInvalidStakeAmount
              ? newTotalStaked
              : "Not Enough LP tokens in Wallet!"
            : "No wallet connected"}
        </Text>
      </Center>
      <Center flexDirection="column">
        <Text>Estimated Gas Cost:</Text>
        <Text>0.001 Gwei</Text>
      </Center>

      <Center gap={2}>{renderStakeButton()}</Center>
    </VStack>
  );
}
