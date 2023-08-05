import { AbiTypeToPrimitiveType } from "abitype";

export type address = AbiTypeToPrimitiveType<"address">;
export type returnToastProps = {
  type: string;
  icon: string;
  message: string;
};

export type getToastProps = {
  lpTokenBalance: string;
  lpTokenStaked: string;
  StakeWillFail: boolean;
  EthBalance: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  txn: Object;
  setToastProps: Function;
};
