import { Button, Center, Input } from "@chakra-ui/react";

export default function StakeInput({
  newStakeAmount,
  setNewStakeAmount,
  handleAllButtonClick,
  isInvalidStakeAmount,
  lpTokenBalance,
}: any) {
  return (
    <Center position="relative">
      <Input
        borderRadius={"4px"}
        placeholder="0.0"
        width="100%"
        color="white"
        _placeholder={{ color: "white" }}
        _focus={{ borderColor: "poktLime" }}
        _hover={{ borderColor: "poktLime" }}
        _invalid={{ borderColor: "red" }}
        borderWidth={2}
        height={"52px"}
        type="number"
        value={newStakeAmount}
        defaultValue={0.0}
        onChange={(e) => setNewStakeAmount(Number(e.target.value))}
        isInvalid={isInvalidStakeAmount}
        min={0}
        max={lpTokenBalance?.formatted}
      />
      <Button
        paddingX={"32px"}
        paddingY={"16px"}
        borderWidth={2}
        borderRadius={"12px"}
        fontSize={"16px"}
        onClick={handleAllButtonClick}
        position="absolute"
        right={3}
        float="right"
        zIndex={5}
      >
        All
      </Button>
    </Center>
  );
}
