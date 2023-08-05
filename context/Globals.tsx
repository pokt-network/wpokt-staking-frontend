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
import { sepolia, useAccount, useBalance } from "wagmi";
const vitalik: address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
export interface GlobalContextProps {
  mobile: boolean;
  isClient: boolean;
  showToast: ({ type, icon, message }: any) => void;
  lpTokenBalance: bigint;
  ethBalance: bigint;
  lpTokenStaked: bigint;
  pendingRewards: bigint;
  chainId?: number;
  gasEstimates: Array<bigint>;

  setTxnHash: (hash: string) => void;
  address: address;
  isConnected: boolean;
}

export const GlobalContext = createContext<GlobalContextProps>({
  mobile: false,
  isClient: false,
  showToast: () => {},
  lpTokenBalance: BigInt(0),
  ethBalance: BigInt(0),
  lpTokenStaked: BigInt(0),
  pendingRewards: BigInt(0),
  chainId: sepolia.id,
  gasEstimates: [BigInt(1), BigInt(1), BigInt(1)],

  setTxnHash: () => {},
  address: "0x0000000",
  isConnected: false,
});

export const useGlobalContext = () => useContext(GlobalContext);

export function GlobalContextProvider({ children }: any) {
  const [isClient, setIsClient] = useState(false);
  const [mobile, setMobile] = useState(false);
  const chainId = sepolia.id;
  // using vitalik's address just for null-safety
  const { address: userAddress, isConnected } = useAccount() ?? {
    address: vitalik,
    isConnected: false,
  };
  const [gasEstimates, setGasEstimates] = useState<bigint[]>([]);
  const GasEstimator = useCallback(async () => {
    const stakingGasEstimate = isConnected ? await GasEstimate({
      method: "stake",
      amount: "0.000001",
      address: (userAddress as address) || vitalik,
    }) : BigInt(0);

    const withdrawGasEstimate = isConnected ? await GasEstimate({
      method: "withdraw",
      amount: "0.000001",
      address: (userAddress as address) || vitalik,
    }) : BigInt(0);

    const approvalGasEstimate = isConnected ? await ApprovalGasEstimate({
      amount: "0.000001",
      address: (userAddress as address) || vitalik,
    }) : BigInt(0);
    
    
    return [stakingGasEstimate, withdrawGasEstimate, approvalGasEstimate]
    
  }, [isConnected, userAddress]);

  const [txnHash, setTxnHash] = useState("");

  const { data: ethBalanceRaw } = useBalance({
    address: (userAddress as address) || vitalik,
  });

  const ethBalance = ethBalanceRaw?.value ?? BigInt(0);

  const { data: lpTokenBalanceRaw } = useLPTokenBalance(userAddress as address);

  const lpTokenBalance = lpTokenBalanceRaw?.value ?? BigInt(0);
  const { data: lpTokenStakedRaw } = useStakedTokenBalance(
    (userAddress as address) || vitalik
  );

  const lpTokenStaked = (lpTokenStakedRaw as bigint) || BigInt(0);

  const { data: pendingRewardsRaw } = usePendingRewardBalance(
    (userAddress as address) || vitalik
  );
  const pendingRewards = (pendingRewardsRaw as bigint) ?? BigInt(0);
  const toast = useToast();

  const showToast = useCallback(
    ({ type, icon, message }: any) => {
      if (!toast) return;
      toast({
        isClosable: true,
        duration: 10000,
        render: () => (
          <Box
            height={"48px"}
            borderWidth={2}
            borderRadius={"12px"}
            fontSize={"16px"}
            borderColor="poktBlue"
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
    [toast]
  );

  useEffect(() => {
    setIsClient(true);
    GasEstimator().then((resp:any) => setGasEstimates(resp));

    toggleMobile();
    window.addEventListener("resize", toggleMobile);
    return () => window.removeEventListener("resize", toggleMobile);
  }, [isConnected, GasEstimator]);

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
      showToast,
      lpTokenBalance,
      ethBalance,
      lpTokenStaked,
      chainId,
      pendingRewards,
      gasEstimates,

      setTxnHash,
      isConnected,
      address: userAddress as address,
    }),
    [
      mobile,
      isClient,
      showToast,
      lpTokenBalance,
      ethBalance,
      lpTokenStaked,
      chainId,
      pendingRewards,
      gasEstimates,

      isConnected,
      userAddress,
    ]
  );
  console.log(contextValue);
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
