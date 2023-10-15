"use client";

import { Box, Text, useToast } from "@chakra-ui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { zeroAddress } from "viem";
import { Address, useAccount, useBalance, useWaitForTransaction } from "wagmi";

import { BlueCheckIcon, ErrorIcon } from "@/components/icons/misc";
import { BluePoktIcon } from "@/components/icons/pokt";
import {
  useLPTokenBalance,
  usePendingRewardBalance,
  useStakedTokenBalance,
  useSWRFetch,
} from "@/utils/contract/hooks";

export type TokenUSDPrices = {
  eth: string;
  pokt: string;
};

export interface GlobalContextProps {
  mobile: boolean;
  isClient: boolean;
  lpTokenBalance: bigint;
  ethBalance: bigint;
  lpTokenStaked: bigint;
  pendingRewards: bigint;
  txnHash: any;
  setTxnHash: (hash: string) => void;
  address: Address;
  prices: TokenUSDPrices;
  isConnected: boolean;
}

export const GlobalContext = createContext<GlobalContextProps>({
  mobile: false,
  isClient: false,
  lpTokenBalance: BigInt(0),
  ethBalance: BigInt(0),
  lpTokenStaked: BigInt(0),
  pendingRewards: BigInt(0),
  txnHash: "",
  setTxnHash: () => {},
  address: zeroAddress,
  isConnected: false,
  prices: { eth: "0", pokt: "0" },
});

export const useGlobalContext = () => useContext(GlobalContext);

export function GlobalContextProvider({ children }: any) {
  const [isClient, setIsClient] = useState(false);
  const [mobile, setMobile] = useState(false);

  const { data: ethPrice } = useSWRFetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  );
  const { data: poktPrice } = useSWRFetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=pocket-network&vs_currencies=usd",
  );

  const prices: TokenUSDPrices = useMemo(
    () => ({
      eth: ethPrice?.ethereum.usd || "0",
      pokt: poktPrice?.["pocket-network"].usd || "0",
    }),
    [ethPrice, poktPrice],
  );

  const { address, isConnected } = useAccount();

  const userAddress = address ?? zeroAddress;

  const [txnHash, setTxnHash] = useState("");

  const { data: ethBalanceRaw } = useBalance({
    address: userAddress,
  });

  const ethBalance = ethBalanceRaw?.value ?? BigInt(0);

  const { data: lpTokenBalanceRaw, refetch: lptTokenRefetch } =
    useLPTokenBalance(userAddress);

  const lpTokenBalance = lpTokenBalanceRaw?.value ?? BigInt(0);
  const { data: lpTokenStakedRaw, refetch: stakedBalRefetch } =
    useStakedTokenBalance(userAddress);

  const lpTokenStaked = (lpTokenStakedRaw as bigint) || BigInt(0);

  const { data: pendingRewardsRaw } = usePendingRewardBalance(userAddress);
  const pendingRewards = (pendingRewardsRaw as bigint) ?? BigInt(0);
  const toast = useToast();

  const showToast = useCallback(
    ({ type, icon, message, duration }: any) => {
      if (!toast) return;
      toast({
        isClosable: true,
        duration: duration ?? 5000,
        render: () => (
          <Box
            height={"48px"}
            borderWidth={2}
            borderRadius={"4px"}
            fontSize={"16px"}
            borderColor={type == "error" ? "red" : "poktBlue"}
            border={"0px 0px 1px 0px"}
            bg="#182129"
            color="white"
            paddingLeft={"20px"}
            position={"absolute"}
            top={"80px"}
            right={"20px"}
            flexDirection={"row"}
            alignItems={"center"}
            m={2}
            boxShadow={"0px 8px 12px 0px rgba(0, 0, 0, 0.30)"}
          >
            {icon}
            <Text p={2} display={"inline-flex"} pt={2.5}>
              {message}
            </Text>
          </Box>
        ),
      });
    },
    [toast],
  );

  const { data: txStatus } = useWaitForTransaction({
    hash: txnHash as any,
  });

  const toaster = useCallback(() => {
    toast.closeAll();
    lptTokenRefetch();
    stakedBalRefetch();

    if (
      Boolean(txnHash) &&
      txStatus?.status != "reverted" &&
      txStatus?.status != "success"
    ) {
      showToast({
        id: "awaiting-confirmation",
        type: "info",
        duration: 10000,
        icon: <BluePoktIcon boxSize={"24px"} />,
        message: "Awaiting Txn Confirmation",
      });
    }

    if (
      txnHash &&
      txStatus?.status === "success" &&
      !toast.isActive("txn-confirmed")
    ) {
      showToast({
        id: "txn-confirmed",
        type: "success",
        duration: 10000,
        icon: <BlueCheckIcon boxSize={"24px"} />,
        message: "Txn Confirmed",
      });
    }
    if (txnHash && txStatus?.status === "reverted") {
      showToast({
        id: "txn-failed",
        type: "error",
        duration: 10000,
        icon: <ErrorIcon boxSize={"24px"} />,
        message: "Txn Failed",
      });
    }
  }, [
    lptTokenRefetch,
    showToast,
    stakedBalRefetch,
    toast,
    txStatus?.status,
    txnHash,
  ]);

  useEffect(() => {
    setIsClient(true);
    toaster();

    function toggleMobile() {
      if (window && window.innerWidth < 500) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    }

    toggleMobile();
    window.addEventListener("resize", toggleMobile);
    return () => window.removeEventListener("resize", toggleMobile);
  }, [toaster, txnHash, userAddress]);

  return (
    <GlobalContext.Provider
      value={{
        mobile,
        isClient,
        lpTokenBalance,
        ethBalance,
        lpTokenStaked,
        pendingRewards,
        txnHash,
        setTxnHash,
        isConnected,
        address: userAddress,
        prices,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
