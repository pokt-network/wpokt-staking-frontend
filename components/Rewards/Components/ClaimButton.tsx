"use client";
import { Button } from "@chakra-ui/react";

export default function ClaimButton({
  handleClaimButtonClick,
  isInvalidClaimAmount,
}: any) {
  return (
    <Button
      paddingX={'32px'}
      paddingY={'16px'}
      borderWidth={2}
      borderRadius={"12px"}
      fontSize={"16px"}
      onClick={handleClaimButtonClick}
      isDisabled={isInvalidClaimAmount}
    >
      Claim wPOKT
    </Button>
  );
}
