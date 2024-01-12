"use client";

import {
  Center,
  Divider,
  Flex,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import RewardsWidget from "@/components/Rewards/RewardsWidget";
import { Footer } from "@/components/Shared/Footer";
import { Header } from "@/components/Shared/Header";
import LPInfoBlock from "@/components/Shared/LPInfoBlock";
import StakingWidget from "@/components/Stake/StakingWidget";
import UnstakeWidget from "@/components/Unstake/UnstakeWidget";
import { GlobalContextProvider, useGlobalContext } from "@/context/Globals";

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
          maxWidth={"90%"}
          isFitted={true}
          width={mobile ? "100%" : "900px"}
          alignSelf={"center"}
        >
          <TabList bg="transparent" border={"none"} width={"100%"}>
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={"16px 16px"}
              borderTopRadius={8}
              bg="darkBlue"
              borderWidth={1}
              borderBottomWidth={2}
              borderColor={"poktLime"}
              _selected={{
                borderWidth: "2px",
                borderBottom: "none",
              }}
              _hover={{ color: "poktBlue" }}
            >
              Stake
            </Tab>
            <Tab
              color={"poktLime"}
              fontSize={16}
              fontWeight={"medium"}
              padding={"16px 16px"}
              borderTopRadius={8}
              bg="darkBlue"
              borderWidth={1}
              borderBottomWidth={2}
              borderColor={"poktLime"}
              _selected={{
                borderWidth: "2px",
                borderBottom: "none",
              }}
              _hover={{ color: "poktBlue" }}
            >
              Withdraw
            </Tab>
          </TabList>

          <TabPanels borderWidth={2} borderColor={"white"}>
            <TabPanel pt={4}>
              <StakingWidget />
            </TabPanel>
            <TabPanel pt={4}>
              <UnstakeWidget />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Center
          borderWidth={2}
          borderColor="white"
          alignSelf={"center"}
          maxW={"90%"}
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
