import { Button } from "@chakra-ui/react";

export default function StakeButton({
  isInvalidStakeAmount,
  newStakeAmount,
  handleStakeButtonClick,
  approved,
  isLoading,
}: any) {
  return (
    <Button
      height={"52px"}
      borderRadius={"4px"}
      fontSize={"16px"}
      bg={"poktLime"}
      _hover={{ bg: "hover.poktLime" }}
      fontWeight={"normal"}
      onClick={handleStakeButtonClick}
      isDisabled={isInvalidStakeAmount || Number(newStakeAmount) === 0}
      isLoading={isLoading}
    >
      {!approved ? "Approve" : "Stake"}
    </Button>
  );
}
