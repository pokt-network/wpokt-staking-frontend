"use client"

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
} from "@chakra-ui/react";

import RewardsWidget from "@/components/Rewards/RewardsWidget";
import LPInfoBlock from "@/components/Shared/LPInfoBlock";
import StakingWidget from "@/components/Stake/StakingWidget";
import UnstakeWidget from "@/components/Unstake/UnstakeWidget";

export default function Page() {
  const { mobile } = useGlobalContext();

  return (
    <GlobalContextProvider>
      <Flex direction="column" minHeight="100vh" overflowX="hidden" gap={8}>
        <Header />


        <Center paddingX={10} flexDirection={"column"} alignItems={"center"}>
          <Divider borderColor={"poktLime"} />

          <LPInfoBlock />

          <Divider borderColor={"poktLime"} />
        </Center>

        <Tabs
          id={"0"}
          variant="enclosed"
          maxWidth={'90%'}
          isFitted={true}
          width={mobile ? "100%" : "900px"}
          alignSelf={"center"}
        >
          <TabList bg="transparent" border={"none"} width={'100%'} >
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={"16px 16px"}
              borderRadius={"12px 12px 0px 0px"}
              bg="darkOverlay"
              border="none"
              _selected={{
                border: "2px",
                borderColor: "poktLime",
                borderBottom: "none",
              }}
            >
              Stake
            </Tab>
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={"16px 16px"}
              borderRadius={"12px 12px 0px 0px"}
              bg="darkOverlay"
              border="none"
              
              _selected={{
                border: "2px",
                borderColor: "poktLime",
                borderBottom: "none",
              }}
            >
              Withdraw
            </Tab>
          </TabList>

          <TabPanels bg="darkOverlay">
            <TabPanel pt={4}>
              <StakingWidget />
            </TabPanel>
            <TabPanel pt={4}>
              <UnstakeWidget />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Center
          bg="darkOverlay"
          alignSelf={"center"}
          maxW={'90%'}
          width={mobile ? "100%" : "900px"}
        >
          <RewardsWidget />
        </Center>

        <Spacer />
      </Flex>
      <Footer />
    </GlobalContextProvider>
  );
}
