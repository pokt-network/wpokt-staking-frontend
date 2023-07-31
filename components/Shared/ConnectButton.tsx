import { Button } from "@chakra-ui/react";
import { EthIcon } from "../icons/eth";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton() {
    const { openConnectModal } = useConnectModal();
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