"use client";
import { useApprovalEstimate, useGasEstimate } from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";

export default function GasEstimator(args: {
  amount: any;
  method: string;
  willFail: boolean;
  isInvalidAmount: boolean;
}) {
  const [gas, setGas] = useState("");
  const { address: userAddress } = useAccount();
  const amount = args.isInvalidAmount
    ? parseEther(args.amount.toString())
    : parseEther("0.000000000000001");

  const callArgs = {
    method: args.method,
    amount: amount,
    address:
      (userAddress as address) || "0x0000000000000000000000000000000000000000",
  };
  const resp = useGasEstimate(callArgs);
  const resp2 = useApprovalEstimate(callArgs);

  useEffect(() => {
    Promise.all([resp, resp2]).then((values) => {
      const val =
        Number(formatEther(values[0])) +
        (args.method == "withdraw" ? Number(formatEther(values[1])) : 0);
      setGas(String(val));
    });
  });

  const eth = Number(gas).toFixed(18).toString() + " ETH";

  if (args.isInvalidAmount && args.amount != 0) {
    return (
      <Text color={"red"}> {`Invalid Amount, Can't estimate gas fee!`}</Text>
    );
  } else {
    return (
      <Text color={eth ? "white" : "poktLime"}>
        {Number(amount) ? eth : "Estimating"}
      </Text>
    );
  }
}
