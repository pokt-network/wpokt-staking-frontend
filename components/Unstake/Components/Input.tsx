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
          placeholder="0.0"
          width="100%"
          color="white"
          _placeholder={{ color: "white" }}
          _focus={{ borderColor: "poktLime" }}
          _hover={{ borderColor: "poktLime" }}
          _invalid={{ borderColor: "red" }}
          borderRadius={0}
          type="number"
          value={newWithdrawAmount}
          onChange={(e) => setNewWithdrawAmount(Number(e.target.value))}
          isInvalid={isInvalidWithdrawAmount}
          min={0}
          max={Number(lpTokenStakedFormatted)}
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