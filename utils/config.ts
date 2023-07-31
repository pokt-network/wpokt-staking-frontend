import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { alchemyProvider, } from 'wagmi/providers/alchemy';
import { createPublicClient, http } from 'viem'
import {sepolia} from 'viem/chains'


export const { chains, publicClient, webSocketPublicClient } = configureChains(
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

  export default config;


  export const estimationClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
  })