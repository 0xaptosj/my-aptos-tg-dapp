import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWalletClient } from "@thalalabs/surf/hooks";

// Internal components
import { aptosClient, surfClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ABI } from "@/utils/abi";

export function Counter() {
  const [counter, setCounter] = useState<number>(0);
  const { account } = useWallet();
  const { client: walletClient } = useWalletClient();

  useEffect(() => {
    if (!account || !walletClient) {
      console.error("Account or wallet client not available");
      return;
    }

    surfClient()
      .view.count({
        typeArguments: [],
        functionArguments: [account?.address as `0x${string}`],
      })
      .then((result) => {
        setCounter(parseInt(result[0]));
      })
      .catch(console.error);
  }, []);

  const onClickButton = async () => {
    if (!account || !walletClient) {
      console.error("Account or wallet client not available");
      return;
    }

    try {
      const committedTransaction = await walletClient.useABI(ABI).click({
        type_arguments: [],
        arguments: [],
      });
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-medium">Counter {counter}</h4>
      <Button onClick={onClickButton}>Increment counter</Button>
    </div>
  );
}
