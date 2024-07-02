import { BaseDecimal, SwapKitNumber } from "@swapkit/sdk";
import { useCallback, useEffect, useState } from "react";
import { logException } from "services/logger";
import { getVthorState } from "views/Staking/hooks";

export const useVTHORBalance = (address?: string) => {
  const [VTHORBalance, setVTHORBalance] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const getVTHORBalance = useCallback(async () => {
    if (!address) return setVTHORBalance(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));

    try {
      const vTHORBalance = await getVthorState("balanceOf", [address]);
      setVTHORBalance(vTHORBalance);
    } catch (error) {
      logException((error as Todo).toString());
    }
  }, [address]);

  useEffect(() => {
    getVTHORBalance();
  }, [getVTHORBalance]);

  return VTHORBalance;
};
