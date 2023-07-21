import { useGlobalContext } from "@/context/Globals";
import {
    Button, ButtonGroup,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack, IconButton,
    Link,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import logo from "../public/logo/full_white.png";
import { EthIcon } from "./icons/eth";
import { CloseIcon, MenuIcon } from "./icons/misc";


export function Header() {
    const { mobile  } = useGlobalContext()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { openConnectModal } = useConnectModal()
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const width = 220

    return (
        <HStack justify="space-between" align="center" paddingX={10} paddingY={5}>
            <Image src={logo} alt="logo" width={122} height={36} />
            {mobile ? (
                <>
                <IconButton
                    aria-label="menu"
                    icon={<MenuIcon />}
                    background="none"
                    onClick={onOpen}
                />
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                >
                    <DrawerOverlay />
                    <DrawerContent bg="#242C34" color="white" maxW={width}>
                        <DrawerHeader textAlign="center" color="poktBlue">MENU</DrawerHeader>
                        <DrawerBody>
                            {address ? (
                                <VStack spacing={1}>
                                    <Flex align="center" justify="space-between" bg="darkBlue" width={width} padding={2}>
                                        <EthIcon fill="poktBlue" width="26px" height="26px" />
                                        <Text>{address.substring(0,4) + "..." + address.substring(address.length - 4)}</Text>
                                        <CloseIcon width="22.63px" height="22.63px" fill="none" />
                                    </Flex>
                                    <Link
                                        color="poktLime"
                                        textAlign="center"
                                        textDecor="underline"
                                        onClick={() => disconnect()}
                                    >
                                        Disconnect
                                    </Link>
                                </VStack>
                            ) : (
                                <VStack spacing={1}>
                                    <Text fontSize={14}>Connect Ethereum Wallet</Text>
                                    <Button
                                        color="darkBlue"
                                        background="poktLime"
                                        borderWidth={2}
                                        borderColor="poktLime"
                                        leftIcon={<EthIcon />}
                                        onClick={openConnectModal}
                                    >
                                        Connect
                                    </Button>
                                </VStack>
                            )}

                            
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
                </>
            ) : (
                <ButtonGroup>
                    {address ? (
                        <Button
                            color="white"
                            background="darkOverlay"
                            leftIcon={<EthIcon fill="poktBlue" width="28px" height="28px" />}
                            borderWidth={2}
                            borderColor="darkOverlay"
                            padding={4}
                            paddingY={6}
                            onClick={() => disconnect()}
                        >
                            {address.substring(0,4) + "..." + address.substring(address.length - 4)}
                        </Button>
                    ) : (
                        <Button
                            color="darkBlue"
                            background="poktLime"
                            borderWidth={2}
                            borderColor="poktLime"
                            leftIcon={<EthIcon />}
                            padding={4}
                            paddingY={6}
                            onClick={openConnectModal}
                        >
                            Connect
                        </Button>
                    )}

                </ButtonGroup>
            )}
        </HStack>
    )
}