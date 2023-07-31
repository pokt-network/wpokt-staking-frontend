"use client"
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
} from "@chakra-ui/react";
import { useWindowSize } from 'usehooks-ts';


import LPInfoBlock from "@/components/LPInfoBlock";
import StakingWidget from "@/components/Stake/StakingWidget";
import UnstakeWidget from "@/components/Unstake/UnstakeWidget";
import WithdrawRewardsWidget from "@/components/WithdrawRewardsWidget";

export default function Page() {
  const {isClient} = useGlobalContext();
  const { width } = useWindowSize();
  return (
    <GlobalContextProvider>
      <Flex direction="column" minHeight="100vh" overflowX="hidden">
        <Header />
        <Heading size="lg" color="white" textAlign="center" padding={4}>
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
          width={isClient && (width > 1200) ? "1200px" : "100%"}
          id={"0"}
        >
          <TabList flexGrow={1}>
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
        <Center
          bg="darkOverlay">
        <WithdrawRewardsWidget />
        </Center>
        <Spacer />
      </Flex>
      <Footer />
    </GlobalContextProvider>
  );
}
