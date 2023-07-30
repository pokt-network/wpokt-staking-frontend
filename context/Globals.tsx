import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface GlobalContextProps {
  mobile: boolean;
  setMobile: (mobile: boolean) => void;
  ethAddress: string;
  setEthAddress: (address: string) => void;
  isClient: boolean;
}

export const GlobalContext = createContext<GlobalContextProps>({
  mobile: false,
  setMobile: () => {},
  ethAddress: "",
  setEthAddress: () => {},
  isClient: false,
});

export const useGlobalContext = () => useContext(GlobalContext);



export function GlobalContextProvider({ children }: any) {
    const [mobile, setMobile] = useState<boolean>(false);
    const [ethAddress, setEthAddress] = useState<string>("");
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
        toggleMobile();
        window.addEventListener("resize", toggleMobile);
        return () => window.removeEventListener("resize", toggleMobile);
    }, []);

    function toggleMobile() {
        if (window && window.innerWidth < 700) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    }

    const contextValue = useMemo(() => ({
        mobile,
        setMobile,
        ethAddress,
        setEthAddress,
        isClient
    }), [mobile, setMobile, ethAddress, setEthAddress, isClient]);

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}
