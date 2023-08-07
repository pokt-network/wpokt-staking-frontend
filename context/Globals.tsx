"use client";
import {
  ApprovalGasEstimate,
  GasEstimate,
  useLPTokenBalance,
  usePendingRewardBalance,
  useStakedTokenBalance,
} from "@/utils/contract/hooks";
import { address } from "@/utils/types";
import { Box, Text, useToast } from "@chakra-ui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sepolia, useAccount, useBalance, useWaitForTransaction } from "wagmi";
const vitalik: address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
export interface GlobalContextProps {
  mobile: boolean;
  isClient: boolean;
  lpTokenBalance: bigint;
  ethBalance: bigint;
  lpTokenStaked: bigint;
  pendingRewards: bigint;
  chainId?: number;
  txnHash: any;
  setTxnHash: (hash: string) => void;
  address: address;

  isConnected: boolean;
}

export const GlobalContext = createContext<GlobalContextProps>({
  mobile: false,
  isClient: false,
  lpTokenBalance: BigInt(0),
  ethBalance: BigInt(0),
  lpTokenStaked: BigInt(0),
  pendingRewards: BigInt(0),
  chainId: sepolia.id,
  txnHash: "",
  setTxnHash: () => {},
  address: "" as address,
  isConnected: false,
});

export const useGlobalContext = () => useContext(GlobalContext);

export function GlobalContextProvider({ children }: any) {
  const [isClient, setIsClient] = useState(false);
  const [mobile, setMobile] = useState(false);
  const chainId = sepolia.id;

  const { address: userAddress, isConnected } = useAccount();

  const [txnHash, setTxnHash] = useState("");

  const { data: ethBalanceRaw } = useBalance({
    address: (userAddress as address) || vitalik,
  });

  const ethBalance = ethBalanceRaw?.value ?? BigInt(0);

  const { data: lpTokenBalanceRaw } = useLPTokenBalance(userAddress as address);

  const lpTokenBalance = lpTokenBalanceRaw?.value ?? BigInt(0);
  const { data: lpTokenStakedRaw } = useStakedTokenBalance(
    (userAddress as address) || vitalik,
  );

  const lpTokenStaked = (lpTokenStakedRaw as bigint) || BigInt(0);

  const { data: pendingRewardsRaw } = usePendingRewardBalance(
    (userAddress as address) || vitalik,
  );
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
            borderRadius={"12px"}
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

  const { data: txStatus, isSuccess } = useWaitForTransaction({
    hash: txnHash as any,
  });

  const toaster = useCallback(() => {
    if (Boolean(txnHash) && txStatus?.status != "reverted" && txStatus?.status != "success") {
      showToast({
        id: "awaiting-confirmation",
        type: "info",
        duration: 10000,
        icon: "🎉",
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
        icon: "🎉",
        message: "Txn Confirmed",
      });
    }
    if (
      txnHash &&
      txStatus?.status === "reverted" &&
      !toast.isActive("txn-failed")
    ) {
      showToast({
        id: "txn-failed",
        type: "error",
        duration: 10000,
        icon: "🎉",
        message: "Txn Failed",
      });
    }
  }, [showToast, toast, txStatus?.status, txnHash]);

  useEffect(() => {
    setIsClient(true);
    toggleMobile();
    toaster();
    window.addEventListener("resize", toggleMobile);
    return () => window.removeEventListener("resize", toggleMobile);
  }, [showToast, toaster, txnHash]);

  function toggleMobile() {
    if (window && window.innerWidth < 700) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }

  const contextValue: GlobalContextProps = useMemo(
    () => ({
      mobile,
      isClient,
      lpTokenBalance,
      ethBalance,
      lpTokenStaked,
      chainId,
      pendingRewards,
      txnHash,
      setTxnHash,
      isConnected,
      address: userAddress as address,
    }),
    [
      mobile,
      isClient,
      lpTokenBalance,
      ethBalance,
      lpTokenStaked,
      chainId,
      pendingRewards,
      txnHash,
      setTxnHash,
      isConnected,
      userAddress,
    ],
  );
  console.log(contextValue);
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
