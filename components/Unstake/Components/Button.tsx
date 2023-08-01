import { Button } from "@chakra-ui/react";

export default function WithDrawButton({
  newWithdrawAmount,
  isInvalidWithdrawAmount,
  handleWithdrawButtonClick,
  willFail,
}: any) {
  return (
    <Button
      paddingX={"32px"}
      paddingY={"16px"}
      borderWidth={2}
      borderRadius={"12px"}
      fontSize={"16px"}
      onClick={handleWithdrawButtonClick}
      isDisabled={
        isInvalidWithdrawAmount || Number(newWithdrawAmount) === 0 || willFail
      }
    >
      Withdraw
    </Button>
  );
}
