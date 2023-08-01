import { Button, Center, Input } from "@chakra-ui/react";

export default function WithdrawInput({
  newWithdrawAmount,
  setNewWithdrawAmount,
  handleAllButtonClick,
  isInvalidWithdrawAmount,
  lpTokenStakedFormatted,
}: any) {
  return (
    <Center position="relative" width="60%">
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
        value={newWithdrawAmount}
        onChange={(e) => setNewWithdrawAmount(Number(e.target.value))}
        isInvalid={isInvalidWithdrawAmount}
        min={0}
        max={Number(lpTokenStakedFormatted)}
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
