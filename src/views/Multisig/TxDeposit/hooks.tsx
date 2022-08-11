import { useCallback, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { AddLiquidityParams, Asset, Memo } from '@thorswap-lib/multichain-sdk'

import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks'
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools'
import { useMultisigWallet } from 'views/Multisig/hooks'
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext'
import { useAssetsList } from 'views/Multisig/TxDeposit/useAssetsList'
import { useDepositAssetsBalance } from 'views/Multisig/TxDeposit/useDepositAssetsBalance'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { LiquidityTypeOption } from 'components/LiquidityType/types'

import { useMultisig } from 'store/multisig/hooks'

import { useLiquidityType } from 'hooks/useLiquidityType'

import { t } from 'services/i18n'

import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants/router'

export const useTxDeposit = (assetSideAddress: string) => {
  const { signers } = useTxCreate()
  const { wallet } = useMultisigWallet()
  const assetRouteGetter = useCallback(
    (asset: Asset) => getMultisigTxCreateRoute(asset),
    [],
  )

  const { liquidityType, setLiquidityType } = useLiquidityType()
  const { poolAssets, pools, pool, poolAsset, handleSelectPoolAsset } =
    useAddLiquidityPools({ assetRouteGetter })
  const depositAssetsBalance = useDepositAssetsBalance({ poolAsset })

  const poolAssetList = useAssetsList({ poolAssets })
  const navigate = useNavigate()
  const { createDepositTx } = useMultisig()

  const onAddLiquidity = async ({ runeAmount, pool }: AddLiquidityParams) => {
    if (runeAmount?.gt(0)) {
      const tx = await createDepositTx(
        {
          memo: Memo.depositMemo(
            pool.asset,
            liquidityType === LiquidityTypeOption.SYMMETRICAL
              ? assetSideAddress
              : undefined,
          ),
          amount: runeAmount.amount,
          asset: runeAmount.asset,
        },
        signers,
      )

      if (tx) {
        navigate(ROUTES.TxMultisig, {
          state: { tx, signers },
        })
      }
    }
  }

  const addLiquidity = useAddLiquidity({
    onAddLiquidity,
    skipWalletCheck: true,
    liquidityType,
    setLiquidityType,
    poolAsset,
    poolAssets,
    pools,
    pool,
    depositAssetsBalance,
    wallet,
  })

  const confirmInfo = useMemo(() => {
    const info: InfoRowConfig[] = []

    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      info.push({
        label: `${t('views.liquidity.depositAmount')} ${
          addLiquidity.poolAssetInput.asset.symbol
        }`,
        value: (
          <Box justify="between" alignCenter>
            <Typography fontWeight="semibold" className="mx-2">
              {addLiquidity.poolAssetInput.value.toSignificant(6)}
            </Typography>
            <AssetIcon asset={addLiquidity.poolAssetInput.asset} size={24} />
          </Box>
        ),
      })
    }

    info.push({
      label: `${t('views.liquidity.depositAmount')} ${Asset.RUNE().symbol}`,
      value: (
        <Box justify="between" alignCenter>
          <Typography fontWeight="semibold" className="mx-2">
            {addLiquidity.runeAssetInput.value.toSignificant(6)}
          </Typography>
          <AssetIcon asset={Asset.RUNE()} size={24} />
        </Box>
      ),
    })

    if (pool) {
      info.push({
        label: t('common.memo'),
        value: Memo.depositMemo(
          pool.asset,
          liquidityType === LiquidityTypeOption.SYMMETRICAL
            ? assetSideAddress
            : undefined,
        ),
      })
    }

    return info
  }, [
    addLiquidity.poolAssetInput.asset,
    addLiquidity.poolAssetInput.value,
    addLiquidity.runeAssetInput.value,
    assetSideAddress,
    liquidityType,
    pool,
  ])

  return {
    handleSelectPoolAsset,
    poolAssetList,
    liquidityType,
    pool,
    poolAsset,

    ...addLiquidity,
    confirmInfo,
  }
}
