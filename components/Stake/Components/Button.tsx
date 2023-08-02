import { Button } from "@chakra-ui/react";

export default function StakeButton({
  isInvalidStakeAmount,
  newStakeAmount,
  handleStakeButtonClick,
  willFail,
  isLoading,
}: any) {
  return (
    <Button
      paddingX={"32px"}
      paddingY={"16px"}
      borderWidth={2}
      borderRadius={"12px"}
      fontSize={"16px"}
      onClick={handleStakeButtonClick}
      isDisabled={
        isInvalidStakeAmount || Number(newStakeAmount) === 0
      }
      isLoading={isLoading}
      
    >
      {willFail ? "Approve" : "Stake"}
    </Button>
  );
}