import { Button } from "@chakra-ui/react";

export default function WithDrawButton({
    newWithdrawAmount,
    isInvalidWithdrawAmount,
    handleWithdrawButtonClick,
    willFail,
  }: any) {
    return (
      <Button
        
        onClick={handleWithdrawButtonClick}
        isDisabled={isInvalidWithdrawAmount || Number(newWithdrawAmount) === 0 || willFail}
      >
        Withdraw
      </Button>
    );
  }