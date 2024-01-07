"use client";
import { Button, ButtonGroup, HStack, Text } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRef } from "react";
import { useHover } from "usehooks-ts";
import { useAccount, useDisconnect } from "wagmi";

import { BlueEthIcon, EthIcon } from "@/components/icons/eth";
import { useGlobalContext } from "@/context/Globals";

export function Header() {
  const { mobile, isClient } = useGlobalContext();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <HStack justify="space-between" align="center" paddingX={10} paddingY={5}>
      <HStack alignItems={"center"}>
        <Image
          src={"/logo/full_white_rebrand.png"}
          alt="logo"
          width={122}
          height={36}
        />
        <Text
          color="white"
          textAlign="center"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="700"
          lineHeight="18px"
          mt={1}
        >
          Stake
        </Text>
      </HStack>
      ( address ?
      <ButtonGroup>
        {address && isClient ? (
          <Button
            height={"52px"}
            width={"160px"}
            borderWidth={2}
            borderRadius={"4px"}
            fontSize={"16px"}
            color="white"
            background="darkBlue"
            leftIcon={
              !isHover ? <BlueEthIcon width="28px" height="28px" /> : <></>
            }
            borderColor="white"
            onClick={() => disconnect()}
            ref={hoverRef}
            flexDirection={"row"}
            // _hover={{ bg: "darkOverlay" }}
            _hover={{ borderColor: "poktBlue", color: "poktBlue" }}
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
            borderRadius={"4px"}
            fontSize={"16px"}
            color="darkBlue"
            background="poktLime"
            borderColor="poktLime"
            _hover={{ bg: "hover.poktLime", borderColor: "hover.poktLime" }}
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
