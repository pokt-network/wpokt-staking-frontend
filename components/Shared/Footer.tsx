"use client";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useGlobalContext } from "@/context/Globals";

import { DiscordIcon, GithubIcon, TwitterIcon } from "../icons/socials";

export function Footer() {
  const { isClient, mobile } = useGlobalContext();

  return (
    <Flex
      direction="column"
      justify="center"
      paddingX={10}
    >
      <Flex
        direction={isClient && mobile ? "column" : "row"}
        justify="space-between"
        padding={10}
        gap={isClient && mobile ? 10 : 4}
      >
        <Flex direction="column" gap={4}>
          <Box>
            <Heading size="sm">Connect With Us</Heading>
          </Box>
          <Flex gap={8}>
            <Link
              _hover={{ color: "poktBlue" }}
              href="https://discord.com/invite/pokt"
              isExternal
            >
              <DiscordIcon
                width={8}
                height={8}
                href="https://discord.com/invite/pokt"
              />
            </Link>
            <Link
              _hover={{ color: "poktBlue" }}
              href="https://github.com/pokt-network/pocket"
              isExternal
            >
              <GithubIcon
                width={8}
                height={8}
                href="https://github.com/pokt-network/pocket"
              />
            </Link>
            <Link
              _hover={{ color: "poktBlue" }}
              href="https://twitter.com/POKTnetwork"
              isExternal
            >
              <TwitterIcon
                width={8}
                height={8}
                href="https://twitter.com/POKTnetwork"
              />
            </Link>
          </Flex>
        </Flex>
        <VStack align="left" spacing={1}>
          <Heading size="sm">Resources</Heading>
          <Link
            _hover={{ color: "poktBlue" }}
            href="https://docs.pokt.network"
            isExternal
          >
            Documentation
          </Link>
          <Link
            _hover={{ color: "poktBlue" }}
            href="https://poktscan.com"
            isExternal
          >
            Explorer
          </Link>
          <Link
            _hover={{ color: "poktBlue" }}
            href="https://forum.pokt.network"
            isExternal
          >
            Forum
          </Link>
          <Link
            _hover={{ color: "poktBlue" }}
            href="https://v2.info.uniswap.org/pair/0xa7fd8ff8f4cada298286d3006ee8f9c11e2ff84e"
            isExternal
          >
            Uniswap Pool
          </Link>
        </VStack>
      </Flex>
      {mobile && <Center mb={2}>© 2023 Pocket Network</Center>}
      <HStack alignSelf="center" mb={4}>
        {!mobile && <Text>© 2023 Pocket Network</Text>}
        {!mobile && <Text>|</Text>}
        <Link
          _hover={{ color: "poktBlue" }}
          href="https://www.pokt.network/privacy-policy"
          isExternal
        >
          Terms of Use
        </Link>
        <Text>|</Text>
        <Link
          _hover={{ color: "poktBlue" }}
          href="https://www.pokt.network/terms-of-use"
          isExternal
        >
          Privacy Policy
        </Link>
      </HStack>
    </Flex>
  );
}
