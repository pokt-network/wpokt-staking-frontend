import { Button } from "@chakra-ui/react";

export default function StakeButton({
    isInvalidStakeAmount,
    newStakeAmount,
    handleStakeButtonClick,
  }: any) {
    return (
      <Button
        bg="poktLime"
        onClick={handleStakeButtonClick}
        isDisabled={isInvalidStakeAmount || Number(newStakeAmount) === 0}
      >
        Stake
      </Button>
    );
  }
  