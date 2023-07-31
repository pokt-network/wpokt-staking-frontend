import { useGasEstimate } from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import { Button, Center, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from 'wagmi';

export default function StakeInput({
    newStakeAmount,
    setNewStakeAmount,
    handleAllButtonClick,
    isInvalidStakeAmount,
    lpTokenBalance,
    changeHandler
  }: any) {
    
    const {address: userAddress} = useAccount();
    const gasEstResp = useGasEstimate({method:'stake', amount: parseEther(newStakeAmount.toString()) || BigInt(20), address: userAddress as address});

    useEffect(() => {
      gasEstResp
        .then((resp: bigint) => {
          changeHandler(formatEther(resp));
        })
    }, [newStakeAmount]);

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