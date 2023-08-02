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

import RewardsWidget from "@/components/Rewards/RewardsWidget";
import LPInfoBlock from "@/components/Shared/LPInfoBlock";
import StakingWidget from "@/components/Stake/StakingWidget";
import UnstakeWidget from "@/components/Unstake/UnstakeWidget";

export default function Page() {
  const { isClient } = useGlobalContext();
  const { width } = useWindowSize();
  return (
    <GlobalContextProvider>
      <Flex direction="column" minHeight="100vh" overflowX="hidden" gap={20}>
        <Header />
        <Heading size="lg" color="poktBlue" textAlign="center" padding={4}>
          wPOKT-ETH Liquidity Pool Farm
        </Heading>

        <Center paddingX={10} flexDirection={"column"} alignItems={"center"}>
          <Divider borderColor={"poktLime"} />

          <LPInfoBlock />

          <Divider borderColor={"poktLime"} />
        </Center>

        <Tabs
          id={"0"}
          variant="enclosed"
          bg="darkOverlay"
          width={width > 900 ? "900px" : width}
          alignSelf={"center"}
        >
          <TabList borderColor={"poktLime"} borderRadius={4}>
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={4}
              borderBottomColor={"poktLime"}
              _active={{ borderBottomColor: "poktLime" }}
            >
              Stake
            </Tab>
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={4}
              borderBottomColor={"poktLime"}
            >
              Withdraw
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel mt={4}>
              <StakingWidget />
            </TabPanel>
            <TabPanel mt={4}>
              <UnstakeWidget />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Center
          bg="darkOverlay"
          alignSelf={"center"}
          width={width > 900 ? "900px" : width}
        >
          <RewardsWidget />
        </Center>

        <Spacer />
      </Flex>
      <Footer />
    </GlobalContextProvider>
  );
}
