"use client";
import { BlueEthIcon, EthIcon } from "@/components/icons/eth";
import { useGlobalContext } from "@/context/Globals";
import logo from "@/public/logo/full_white.png";
import { Button, ButtonGroup, HStack, useDisclosure } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useAccount, useDisconnect } from "wagmi";

export function Header() {
  const { mobile, isClient } = useGlobalContext();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  return (
    <HStack justify="space-between" align="center" paddingX={10} paddingY={5}>
      <Image src={logo} alt="logo" width={122} height={36} />( address ?
      <ButtonGroup>
        {address && isClient ? (
          <Button
            height={"52px"}
            width={"160px"}
            borderWidth={2}
            borderRadius={"12px"}
            fontSize={"16px"}
            color="white"
            background="darkOverlay"
            leftIcon={
              !isHover ? <BlueEthIcon width="28px" height="28px" /> : <></>
            }
            borderColor="darkOverlay"
            onClick={() => disconnect()}
            ref={hoverRef}
            flexDirection={"row"}
            _hover={{ bg: "darkOverlay" }}
          >
            {!isHover
              ? address.substring(0, 4) +
                "..." +
                address.substring(address.length - 4)
              : "Disconnect?"}
          </Button>
        ) : (
          <Button
            height={"52px"}
            borderWidth={2}
            borderRadius={"12px"}
            fontSize={"16px"}
            color="darkBlue"
            background="poktLime"
            borderColor="poktLime"
            leftIcon={<EthIcon />}
            onClick={openConnectModal}
          >
            Connect
          </Button>
        )}
      </ButtonGroup>
      )
    </HStack>
  );
}
