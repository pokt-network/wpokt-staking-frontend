import { Button, Center, Input } from "@chakra-ui/react";

export default function WithdrawInput({
  newWithdrawAmount,
  setNewWithdrawAmount,
  handleAllButtonClick,
  isInvalidWithdrawAmount,
  isLoading,
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
        onChange={(e) => {
          e.preventDefault();
          if (/^\d*\.?\d*$/.test(e.target.value))
            setNewWithdrawAmount(e.target.value);
        }}
        isInvalid={isInvalidWithdrawAmount}
        min={0}
        isDisabled={isLoading}
      />
      <Button
        paddingX={"32px"}
        paddingY={"16px"}
        borderRadius={"4px"}
        fontSize={"16px"}
        onClick={handleAllButtonClick}
        position="absolute"
        right={3}
        fontWeight={"normal"}
        float="right"
        zIndex={5}
        isDisabled={isLoading}
        bg={"poktLime"}
      >
        All
      </Button>
    </Center>
  );
}
