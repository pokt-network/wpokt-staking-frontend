"use client"

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains, createConfig, sepolia } from "wagmi";
import { alchemyProvider, } from 'wagmi/providers/alchemy';


import { theme } from "@/theme";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({apiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)}),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "wPOKT Bridge",
  projectId: `${process.env.NEXT_PUBLIC_APP_PROJECT_ID}`,
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
      
      </RainbowKitProvider>
      </WagmiConfig>
    </CacheProvider>
  )
}
