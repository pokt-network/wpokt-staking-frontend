import { Button } from "@chakra-ui/react";

export default function WithDrawButton({
  isInvalidWithdrawAmount,
  handleWithdrawButtonClick,
  willFail,
}: any) {
  return (
    <Button
      height={"52px"}
      borderRadius={"12px"}
      fontSize={"16px"}
      onClick={handleWithdrawButtonClick}
      bg={"poktLime"}
      isDisabled={isInvalidWithdrawAmount || willFail}
    >
      Withdraw
    </Button>
  );
}
