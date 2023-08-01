import { Button } from "@chakra-ui/react";

export default function StakeButton({
    isInvalidStakeAmount,
    newStakeAmount,
    handleStakeButtonClick,
    willFail,
  }: any) {
    return (
      <Button
        
        onClick={handleStakeButtonClick}
        isDisabled={isInvalidStakeAmount || Number(newStakeAmount) === 0 || willFail}
      >
        Stake
      </Button>
    );
  }
  