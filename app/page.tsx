"use client";
import { Footer } from "@/components/Shared/Footer";
import { Header } from "@/components/Shared/Header";
import { GlobalContextProvider, useGlobalContext } from "@/context/Globals";
import {
  Center,
  Divider,
  Flex,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";

import LPInfoBlock from "@/components/Shared/LPInfoBlock";
import StakingWidget from "@/components/Stake/StakingWidget";
import UnstakeWidget from "@/components/Unstake/UnstakeWidget";
import RewardsWidget from "@/components/Rewards/RewardsWidget";

export default function Page() {
  const { isClient } = useGlobalContext();
  const { width } = useWindowSize();
  return (
    <GlobalContextProvider>
      <Flex direction="column" minHeight="100vh" overflowX="hidden"  >
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

    

        <Tabs
          isFitted
          variant="enclosed"
          alignSelf={"center"}
          bg="darkOverlay"
          m={8}
          borderRadius={"10 10 0 0"}
          width={width > 900 ? "50%" : "100%"}
          id={"0"}
        >
          <TabList >
            
            <Tab>Stake</Tab>
            <Tab>Withdraw</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <StakingWidget />
            </TabPanel>
            <TabPanel>
              <UnstakeWidget />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Center bg="darkOverlay" width={width > 900 ? "50%" : "100%"} alignSelf={"center"}>
          <RewardsWidget />
        </Center>

        <Spacer />
      </Flex>
      <Footer />
    </GlobalContextProvider>
  );
}
