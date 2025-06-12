import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { chainId, RPC_URL, PROJECT_ID } from "./contract/constants";

const chain = [sepolia, mainnet].find((c) => c.id === Number(chainId));

if (!chain) {
  throw new Error(`Chain with id ${chainId} not found`);
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: RPC_URL,
      }),
    }),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "wPOKT Staking",
  projectId: PROJECT_ID,
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  // webSocketPublicClient,
});

export default config;

export const estimationClient = createPublicClient({
  chain,
  transport: http(
    RPC_URL,
  ),
});
