import { Button } from "@chakra-ui/react";

export default function WithDrawButton({
    newWithdrawAmount,
    isInvalidWithdrawAmount,
    handleWithdrawButtonClick,
  }: any) {
    return (
      <Button
        bg="poktLime"
        onClick={handleWithdrawButtonClick}
        isDisabled={isInvalidWithdrawAmount || Number(newWithdrawAmount) === 0}
      >
        Withdraw
      </Button>
    );
  }