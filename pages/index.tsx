import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { Bridge } from "@/components/Bridge";
import { GlobalContextProvider } from "@/context/Globals";

import { Text } from "@chakra-ui/react";
import LPInfoBlock from "@/components/LPInfoBlock";
export default function Home() {
  return (
    <GlobalContextProvider>
      <Flex direction="column" minHeight="100vh" overflowX="hidden">
        <Header />
        <Heading size="lg" color="poktBlue" textAlign="center" padding={4}>
          wPOKT-ETH Liquidity Pool Farm
        </Heading>
        <Center paddingX={10}>
          <Divider borderColor={"poktLime"} />
        </Center>
        
        <LPInfoBlock />
        
        <Center paddingX={10}>
          <Divider borderColor={"poktLime"} />
        </Center>
        {/* Space to be removed */}
        <Spacer />
        <Footer />
      </Flex>
    </GlobalContextProvider>
  );
}
