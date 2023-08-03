"use client";
import { Button } from "@chakra-ui/react";
import { EthIcon } from "../icons/eth";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function ConnectWalletButton() {
  const { openConnectModal } = useConnectModal();
  return (
    <Button
      height={"52px"}
      borderWidth={2}
      borderRadius={"12px"}
      fontSize={"16px"}
      borderColor="poktLime"
      bg="transparent"
      color="white"
      leftIcon={<EthIcon fill={"white"} />}
      onClick={openConnectModal}
      _hover={{ borderColor: "white", bg: "transparent" }}
    >
      Connect Wallet
    </Button>
  );
}
