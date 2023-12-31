"use client";
import { Button } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { colors } from "@/theme";

import { EthIcon } from "../icons/eth";

export default function ConnectWalletButton() {
  const { openConnectModal } = useConnectModal();
  return (
    <Button
      height={"52px"}
      borderWidth={2}
      borderRadius={"4px"}
      fontSize={"16px"}
      borderColor="poktLime"
      bg="transparent"
      color="white"
      fontWeight={"normal"}
      leftIcon={<EthIcon fill={"white"} />}
      onClick={openConnectModal}
      _hover={{ bg: `${colors.darkOverlay}` }}
    >
      Connect Wallet
    </Button>
  );
}
