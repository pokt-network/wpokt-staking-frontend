import { useGasEstimate } from "@/utils/contract/hooks";
import { address } from "@/utils/contract/types";
import { Text } from "@chakra-ui/react";
import { useState } from "react";
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
  const [err, setErr] = useState(false);
  const amount = args.isInvalidAmount
    ? parseEther(args.amount.toString())
    : parseEther("0.000000000000001");
  const resp = useGasEstimate({
    method: args.method,
    amount: amount,
    address:
      (userAddress as address) || "0x0000000000000000000000000000000000000000",
  });

  if ((!args.willFail && Number(amount)) || Number(gas) == 0) {
    resp
      .then((res) => {
        setGas(res.toString());
      })
      .catch((err) => {
        // if(args.isInvalidAmount && args.willFail)
        //   setErr(true);
      });
  }

  const eth = formatEther(BigInt(gas));

  if (err) {
    return (
      <Text color={"red"}>
        {"You don't have enough balance! "}
        {args.method == "stake" ? "to stake!" : "to unstake!"}
      </Text>
    );
  }

  if (args.isInvalidAmount && !(args.amount == 0)) {
    return (
      <Text color={"red"}> {`Invalid Amount, Can't estimate gas fee!`}</Text>
    );
  }

  if (args.willFail && Number(args.amount)!= 0) {
    return (
      <Text color={"red"}>
        {`Not enough Gas, Try lower amount!`}
      </Text>
    );
  }

  return (
    <Text color={eth ? "white" : "poktLime"}>
      {Number(amount)  ? eth + " eth" : "Estimating"}
    </Text>
  );
}
