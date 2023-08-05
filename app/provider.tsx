"use client";

import "@fontsource-variable/manrope";

import config, { chains } from "@/utils/config";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";

import { theme } from "@/theme";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider>
      <WagmiConfig config={config}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "rgba(185, 240, 0, 1)",
            fontStack: "system",
            overlayBlur: "small",
            borderRadius: "small",
          })}
        >
          <ChakraProvider
            theme={theme}
            toastOptions={{ defaultOptions: { position: "top-right" } }}
          >
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </CacheProvider>
  );
}
