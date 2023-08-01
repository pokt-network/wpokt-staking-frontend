import { Button, Center, Input } from "@chakra-ui/react";

export default function StakeInput({
    newStakeAmount,
    setNewStakeAmount,
    handleAllButtonClick,
    isInvalidStakeAmount,
    lpTokenBalance,
  }: any) {


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