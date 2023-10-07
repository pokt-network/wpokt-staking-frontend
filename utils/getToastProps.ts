import { getToastProps, returnToastProps } from "./types";

// Switch case for returning data for different txn stages

export const getToast = (args: getToastProps): returnToastProps => {
  // Cases -
  // 1. low number of tokens,
  // 2. not enough gas in wallet,
  // 3. stake will fail because token need to be approved, User must approve tokens before staking
  // 4. Transaction is Loading
  // 5. User Rejected Transaction
  // 6. Transaction Posted to Queue, Awaiting Confirmation
  // 7. Transaction Confirmed
  // 8. Transaction Failed

  switch (true) {
    case Number(args.lpTokenBalance) < 1e-12:
      return {
        type: "warning",
        icon: "warning",
        message: "You don't have enough tokens to stake",
      };
    case Number(args.EthBalance) < 1e-12:
      return {
        type: "warning",
        icon: "warning",
        message: "You don't have enough gas to stake",
      };
    case args.StakeWillFail:
      return {
        type: "warning",
        icon: "warning",
        message: "You must approve tokens before staking",
      };
    case args.isLoading:
      return {
        type: "info",
        icon: "info",
        message: "Transaction is loading",
      };
    case args.isError:
      return {
        type: "error",
        icon: "error",
        message: "Transaction was rejected",
      };
    case args.txn && (args.txn as { status?: string }).status === "confirmed":
      return {
        type: "success",
        icon: "success",
        message: "Transaction confirmed",
      };
    case args.txn && (args.txn as { status?: string }).status === "failed":
      return {
        type: "error",
        icon: "error",
        message: "Transaction failed",
      };
    case args.txn:
      return {
        type: "info",
        icon: "info",
        message: "Transaction posted to queue, awaiting confirmation",
      };
    default:
      return {
        type: "error",
        icon: "error",
        message: "Something Went Wrong",
      };
  }
};
