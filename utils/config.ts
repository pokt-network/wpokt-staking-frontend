import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Chain, createPublicClient, http } from "viem";
import { sepolia, mainnet, goerli } from "viem/chains";
import { chainId } from "./contract/constants";

const chain = [sepolia, mainnet, goerli].find((c) => c.id === Number(chainId))

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chain as Chain],
  [
    publicProvider(),
  ],
);


const { connectors } = getDefaultWallets({
  appName: "wPOKT Staking",
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
  chain,
  transport: http(),
});
