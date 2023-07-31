import { Button } from "@chakra-ui/react";

export default function ClaimButton({ handleClaimButtonClick, isInvalidClaimAmount }: any) {
    return (
        <Button
            
            onClick={handleClaimButtonClick}
            isDisabled={isInvalidClaimAmount}
        >Claim wPOKT
        </Button>
    )

}