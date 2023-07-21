import {Center, Flex, Button, VStack, Text, Heading, HStack, Divider, Input } from "@chakra-ui/react";
import { useGlobalContext } from "@/context/Globals";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { EthIcon } from "./icons/eth";
import { CloseIcon } from "./icons/misc";
export default function StakingWidget() {
    const {mobile} = useGlobalContext()
    const {address} = useAccount();
    const { openConnectModal } = useConnectModal()
  return (
    
    <VStack
      flexDirection={"column"}
      justify="center"
      align="center"
      fontSize={"16"}
      gap={8}
      textAlign={"center"}
      flexGrow={1}
      bg="darkOverlay"
      mx={ !mobile ? "20%" : "0%"}
      px={10}
      py={10}
    >
      <Heading>Stake LP tokens</Heading>
      <HStack justify={"space-between"} maxWidth={"80%"}>
        <Text>Amount to stake:</Text>
        <Text>No wallet connected</Text>
        </HStack>
        {address ? (
                            
                                <Input
                                    placeholder="0.0"
                                    color="white"
                                    _placeholder={{ color: "white" }}
                                    _focus={{ borderColor: "poktLime" }}
                                    _hover={{ borderColor: "poktLime" }}
                                    maxWidth={"60%"}
                                    borderRadius={0}
                                    />
                            
                        ) : (
                            <Center>
                                <Button
                                    variant="outline"
                                    borderColor="poktLime"
                                    bg="transparent"
                                    color="white"
                                    leftIcon={<EthIcon fill={"white"}/>}
                                    onClick={openConnectModal}
                                >
                                    Connect Wallet
                                </Button>
                            </Center>
                        )}
        
          <Divider borderColor={"poktLime"} marginX={20}/>


          <Center flexDirection={"column"}>
            <Text>Currently Staked</Text>
            <Text>0.00001</Text>
            </Center>
            <Center flexDirection={"column"}>
            <Text>New Total Staked:</Text>
            <Text>000001.00</Text>
            </Center>
            <Center flexDirection={"column"}>
            <Text>Estimated Gas Cost:</Text>
            <Text>0.001 Gwei</Text>
            </Center>
            
            <Center gap={2}>
                        <Button bg="poktLime" onClick={() => console.log("Pressed it")} isDisabled={false}>
                            Unwrap
                        </Button>
                        <Button bg="darkBlue" borderColor={"poktLime"} color={"white"}  onClick={() => console.log("Pressed it")} isDisabled={false}>
                            Withdraw Stake
                        </Button>
            </Center>
        
    </VStack>
    
  );
}
