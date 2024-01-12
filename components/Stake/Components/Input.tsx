import { Button, Center, Input } from "@chakra-ui/react";

export default function StakeInput({
  newStakeAmount,
  setNewStakeAmount,
  handleAllButtonClick,
  isInvalidStakeAmount,
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
        value={newStakeAmount}
        onChange={(e) => {
          e.preventDefault();
          if (/^\d*\.?\d*$/.test(e.target.value))
            setNewStakeAmount(e.target.value);
        }}
        isInvalid={isInvalidStakeAmount}
        min={0}
        isDisabled={isLoading}
      />
      <Button
        color="darkBlue"
        paddingX={"32px"}
        paddingY={"16px"}
        borderRadius={"4px"}
        fontSize={"16px"}
        onClick={handleAllButtonClick}
        fontWeight={"normal"}
        position="absolute"
        right={3}
        float="right"
        zIndex={5}
        isDisabled={isLoading}
        bg={"poktLime"}
        _hover={{ bg: "hover.poktLime" }}
      >
        All
      </Button>
    </Center>
  );
}
