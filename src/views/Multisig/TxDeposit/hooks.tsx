import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import { MemoType, getMemoFor } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import type { InfoRowConfig } from "components/InfoRow/types";
import { BTCAsset, RUNEAsset } from "helpers/assets";
import { useAssetsWithBalance } from "hooks/useAssetsWithBalance";
import { useLiquidityType } from "hooks/useLiquidityType";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { ROUTES, getMultisigTxCreateRoute } from "settings/router";
import { LiquidityTypeOption } from "store/midgard/types";
import { useMultisig } from "store/multisig/hooks";
import { useAddLiquidity } from "views/AddLiquidity/hooks/hooks";
import { useAddLiquidityPools } from "views/AddLiquidity/hooks/useAddLiquidityPools";
import { useTxCreate } from "views/Multisig/TxCreate/TxCreateContext";
import { useDepositAssetsBalance } from "views/Multisig/TxDeposit/useDepositAssetsBalance";
import { useMultisigWallet } from "views/Multisig/hooks";

export const useTxDeposit = (assetSideAddress: string) => {
  const { signers } = useTxCreate();
  const { wallet } = useMultisigWallet();
  const assetRouteGetter = useCallback((asset: AssetValue) => getMultisigTxCreateRoute(asset), []);

  const { liquidityType, setLiquidityType } = useLiquidityType();
  const { poolAsset, handleSelectPoolAsset } = useAddLiquidityPools({ assetRouteGetter });
  const depositAssetsBalance = useDepositAssetsBalance({ poolAsset });

  const poolAssetList = useAssetsWithBalance();
  const navigate = useNavigate();
  const { createDepositTx } = useMultisig();

  const onAddLiquidity = async ({
    runeAmount,
    poolAsset,
  }: {
    runeAmount: AssetValue;
    poolAsset: AssetValue;
  }) => {
    if (runeAmount?.gt(0)) {
      const tx = await createDepositTx({
        assetValue: runeAmount,
        memo: getMemoFor(MemoType.DEPOSIT, {
          chain: poolAsset.chain,
          symbol: poolAsset.symbol,
          address: liquidityType === LiquidityTypeOption.SYMMETRICAL ? assetSideAddress : undefined,
        }),
      });

      if (tx) {
        navigate(ROUTES.TxMultisig, { state: { tx, signers } });
      }
    }
  };

  const addLiquidity = useAddLiquidity({
    onAddLiquidity,
    skipWalletCheck: true,
    liquidityType,
    setLiquidityType,
    poolAsset: poolAsset || BTCAsset,
    depositAssetsBalance,
    wallet: wallet ? wallet : undefined,
  });

  const confirmInfo = useMemo(() => {
    const info: InfoRowConfig[] = [];

    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      info.push({
        label: `${t("views.liquidity.depositAmount")} ${addLiquidity.poolAssetInput.asset.symbol}`,
        value: (
          <Box alignCenter justify="between">
            <Text className="mx-2" fontWeight="semibold">
              {addLiquidity.poolAssetInput.value.toSignificant(6)}
            </Text>
            <AssetIcon asset={addLiquidity.poolAssetInput.asset} size={24} />
          </Box>
        ),
      });
    }

    info.push({
      label: `${t("views.liquidity.depositAmount")} ${RUNEAsset.symbol}`,
      value: (
        <Box alignCenter justify="between">
          <Text className="mx-2" fontWeight="semibold">
            {addLiquidity.runeAssetInput.value.toSignificant(6)}
          </Text>
          <AssetIcon asset={RUNEAsset} size={24} />
        </Box>
      ),
    });

    if (poolAsset) {
      info.push({
        label: t("common.memo"),
        value: getMemoFor(MemoType.DEPOSIT, {
          chain: poolAsset.chain,
          symbol: poolAsset.symbol,
          address: liquidityType === LiquidityTypeOption.SYMMETRICAL ? assetSideAddress : undefined,
        }),
      });
    }

    return info;
  }, [
    addLiquidity.poolAssetInput.asset,
    addLiquidity.poolAssetInput.value,
    addLiquidity.runeAssetInput.value,
    assetSideAddress,
    liquidityType,
    poolAsset,
  ]);

  return {
    ...addLiquidity,
    handleSelectPoolAsset,
    poolAssetList,
    liquidityType,
    poolAsset,
    confirmInfo,
  };
};
