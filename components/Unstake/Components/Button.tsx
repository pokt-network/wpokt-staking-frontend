import { Button } from "@chakra-ui/react";

export default function WithDrawButton({
  isInvalidWithdrawAmount,
  handleWithdrawButtonClick,
  willFail,
  isLoading,
}: any) {
  return (
    <Button
      color="darkBlue"
      height={"52px"}
      paddingX={"53px"}
      borderRadius={"30px"}
      fontSize={"16px"}
      onClick={handleWithdrawButtonClick}
      fontWeight={"normal"}
      bg={"poktLime"}
      _hover={{ bg: "hover.poktLime" }}
      isDisabled={isInvalidWithdrawAmount || willFail || isLoading}
      isLoading={isLoading}
    >
      Withdraw
    </Button>
  );
}
