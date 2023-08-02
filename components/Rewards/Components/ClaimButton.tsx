"use client";
import { Button } from "@chakra-ui/react";

export default function ClaimButton({
  handleClaimButtonClick,
  isInvalidClaimAmount,
}: any) {
  return (
    <Button
      height={"52px"}
      borderRadius={"12px"}
      fontSize={"16px"}
      onClick={handleClaimButtonClick}
      isDisabled={isInvalidClaimAmount}
      bg={"poktLime"}
    >
      Claim wPOKT
    </Button>
  );
}
