"use client";
import { useGlobalContext } from "@/context/Globals";
import {
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import logo from "@/public/logo/full_white.png";
import { BlueEthIcon, EthIcon } from "@/components/icons/eth";
import { CloseIcon, MenuIcon } from "@/components/icons/misc";
import { address } from '../../utils/contract/types';

export function Header() {
  const { mobile, isClient } = useGlobalContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const width = 220;

  return (
    <HStack justify="space-between" align="center" paddingX={10} paddingY={5}>
      <Image src={logo} alt="logo" width={122} height={36} />
    ( address ?
        <ButtonGroup>
          {address && isClient ? (
            <Button
              height={'52px'}
              borderWidth={2}
              borderRadius={"12px"}
              fontSize={"16px"}
              color="white"
              background="darkOverlay"
              leftIcon={<BlueEthIcon width="28px" height="28px" />}
              borderColor="darkOverlay"
              onClick={() => disconnect()}
            >
              {address.substring(0, 4) +
                "..." +
                address.substring(address.length - 4)}
            </Button>
          ) : (
            <Button
              height={'52px'}
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
        </ButtonGroup>)
      
    </HStack>
  );
}
