"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

import { theme } from "@/theme";
import config, { chains } from "@/utils/config";

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
