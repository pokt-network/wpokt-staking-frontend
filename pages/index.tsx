import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { GlobalContextProvider } from "@/context/Globals";
import {
  Center,
  Divider,
  Flex,
  Heading,
  Spacer
} from "@chakra-ui/react";

import LPInfoBlock from "@/components/LPInfoBlock";
import StakingWidget from "@/components/StakingWidget";
import UnstakeWidget from "@/components/UnstakeWidget";
import WithdrawRewardsWidget from "@/components/WithdrawRewardsWidget";
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
        <Center padding={10}>
        <StakingWidget/>
        {/* <UnstakeWidget/>
        <WithdrawRewardsWidget/> */}
        
        {/* Space to be removed */}
        </Center>
        <Spacer />
        
        <Footer />
      </Flex>
    </GlobalContextProvider>
  );
}
