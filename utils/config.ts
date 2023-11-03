import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { goerli, mainnet, sepolia } from "viem/chains";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { chainId } from "./contract/constants";

const POKT_KEY = process.env.NEXT_PUBLIC_APP_POKT_KEY;

const chain = [sepolia, mainnet, goerli].find((c) => c.id === Number(chainId));

if (!chain) {
  throw new Error(`Chain with id ${chainId} not found`);
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POKT_KEY}`,
      }),
    }),
    publicProvider(),
  ],
);

const PROJECT_ID = process.env.NEXT_PUBLIC_APP_PROJECT_ID;

if (!PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_APP_PROJECT_ID");
}

const { connectors } = getDefaultWallets({
  appName: "wPOKT Staking",
  projectId: PROJECT_ID,
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
  transport: http(`https://eth-mainnet.gateway.pokt.network/v1/lb/${POKT_KEY}`),
});
