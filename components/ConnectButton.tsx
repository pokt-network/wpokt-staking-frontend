import { Button } from "@chakra-ui/react";
import { EthIcon } from "./icons/eth";


export default function ConnectWalletButton({ openConnectModal}:any) {
    return (
      <Button
        variant="outline"
        borderColor="poktLime"
        bg="transparent"
        color="white"
        leftIcon={<EthIcon fill={"white"} />}
        onClick={openConnectModal}
      >
        Connect Wallet
      </Button>
    );
  }