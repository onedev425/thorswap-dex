import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import {
  Amount,
  Asset,
  Pool,
  Price,
  Liquidity,
  Percent,
  AmountType,
  SupportedChain,
  hasWalletConnected,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { AssetInputs } from 'views/WithdrawLiquidity/AssetInputs'
import { TerraAsymWithdrawInfo } from 'views/WithdrawLiquidity/TerraAsymWithdrawInfo'

import { Button, Box, Typography } from 'components/Atomic'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { InfoTable } from 'components/InfoTable'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { LPTypeSelector } from 'components/LPTypeSelector'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelView } from 'components/PanelView'
import { showToast, ToastType } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'store/midgard/hooks'
import {
  PoolMemberData,
  PoolShareType,
  TxTrackerType,
} from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useMimir } from 'hooks/useMimir'
import { useNetworkFee } from 'hooks/useNetworkFee'
import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { useConfirmInfoItems } from './useConfirmInfoItems'

// TODO: refactor useState -> useReducer
export const WithdrawLiquidity = () => {
  const { assetParam = Asset.BTC().toString() } = useParams<{
    assetParam: string
  }>()
  const [assetObj, setAssetObj] = useState<Asset>()
  const [pool, setPool] = useState<Pool>()

  const { pools, poolLoading, loadMemberDetailsByChain, chainMemberDetails } =
    useMidgard()

  useEffect(() => {
    if (!pool) return
    loadMemberDetailsByChain(pool.asset.chain as SupportedChain)
  }, [loadMemberDetailsByChain, pool])

  const poolMemberData: PoolMemberData | null = useMemo(() => {
    if (!pool) return null
    return (
      chainMemberDetails?.[pool.asset.chain]?.[pool.asset.toString()] ?? null
    )
  }, [chainMemberDetails, pool])

  useEffect(() => {
    if (!poolLoading && pools.length && assetObj) {
      const assetPool = Pool.byAsset(assetObj, pools)

      if (assetPool) {
        setPool(assetPool)
      }
    }
  }, [pools, poolLoading, assetObj])

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return
      }
      const assetEntity = Asset.decodeFromURL(assetParam)

      if (assetEntity) {
        if (assetEntity.isRUNE()) return

        await assetEntity.setDecimal()

        setAssetObj(assetEntity)
      }
    }

    getAssetEntity()
  }, [assetParam])

  if (
    pool &&
    pools.length &&
    poolMemberData &&
    Object.keys(poolMemberData).length
  ) {
    console.info('poolMemberData', poolMemberData)
    const shares = []
    if (poolMemberData.pending) shares.push(PoolShareType.PENDING)

    if (poolMemberData.sym) shares.push(PoolShareType.SYM)
    if (poolMemberData.runeAsym) shares.push(PoolShareType.RUNE_ASYM)
    if (poolMemberData.assetAsym) shares.push(PoolShareType.ASSET_ASYM)

    return (
      <WithdrawPanel
        pool={pool}
        shareTypes={shares}
        pools={pools}
        poolMemberData={poolMemberData}
      />
    )
  }

  return (
    <PanelView
      title={t('views.liquidity.withdrawLiquidity')}
      header={
        <ViewHeader
          withBack
          title={t('views.liquidity.withdrawLiquidity')}
          actionsComponent={<GlobalSettingsPopover />}
        />
      }
    >
      <Typography>{t('views.liquidity.noLiquidityToWithdraw')}</Typography>
    </PanelView>
  )
}

const WithdrawPanel = ({
  poolMemberData,
  pool,
  pools,
  shareTypes,
}: {
  poolMemberData: PoolMemberData
  shareTypes: PoolShareType[]
  pool: Pool
  pools: Pool[]
}) => {
  const [lpType, setLPType] = useState(shareTypes[0])

  const { wallet, setIsConnectModalOpen } = useWallet()

  const poolAsset = useMemo(() => pool.asset, [pool])
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()

  const { isChainPauseLPAction } = useMimir()

  const isLPActionPaused: boolean = useMemo(() => {
    return isChainPauseLPAction(poolAsset.chain)
  }, [poolAsset, isChainPauseLPAction])

  const defaultWithdrawType = useMemo(() => {
    if (lpType === PoolShareType.RUNE_ASYM) {
      return LiquidityTypeOption.RUNE
    }
    if (lpType === PoolShareType.ASSET_ASYM) {
      return LiquidityTypeOption.ASSET
    }
    return LiquidityTypeOption.SYMMETRICAL
  }, [lpType])

  const [withdrawType, setWithdrawType] = useState(defaultWithdrawType)
  const [percent, setPercent] = useState(0)
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)

  const isWalletConnected = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.ASSET) {
      return hasWalletConnected({ wallet, inputAssets: [poolAsset] })
    }
    if (withdrawType === LiquidityTypeOption.RUNE) {
      return hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] })
    }

    // symm
    return (
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] })
    )
  }, [wallet, poolAsset, withdrawType])

  const { inboundFee: inboundAssetFee } = useNetworkFee({
    inputAsset: poolAsset,
  })

  const { inboundFee: inboundRuneFee } = useNetworkFee({
    inputAsset: Asset.RUNE(),
  })

  const sendAsset = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.ASSET) {
      return poolAsset
    }

    return Asset.RUNE()
  }, [withdrawType, poolAsset])

  const feeLabel = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.ASSET) {
      return `${inboundAssetFee.toCurrencyFormat()} (${inboundAssetFee
        .totalPriceIn(Asset.USD(), pools)
        .toCurrencyFormat(2)})`
    }

    return `${inboundRuneFee.toCurrencyFormat()} (${inboundRuneFee
      .totalPriceIn(Asset.USD(), pools)
      .toCurrencyFormat(2)})`
  }, [inboundAssetFee, inboundRuneFee, pools, withdrawType])

  const memberPoolData = useMemo(() => {
    if (lpType === PoolShareType.PENDING) return poolMemberData?.pending
    if (lpType === PoolShareType.RUNE_ASYM) return poolMemberData.runeAsym
    if (lpType === PoolShareType.ASSET_ASYM) return poolMemberData.assetAsym
    if (lpType === PoolShareType.SYM) {
      return poolMemberData.sym
    }

    return null
  }, [poolMemberData, lpType])

  const liquidityEntity = useMemo(() => {
    if (!memberPoolData) return null

    const { liquidityUnits } = memberPoolData

    return new Liquidity(pool, Amount.fromMidgard(liquidityUnits))
  }, [pool, memberPoolData])

  const { runeAmount, assetAmount } = useMemo(() => {
    if (lpType === PoolShareType.PENDING) {
      return {
        runeAmount: Amount.fromMidgard(memberPoolData?.runePending).mul(
          percent / 100,
        ),
        assetAmount: Amount.fromMidgard(memberPoolData?.assetPending).mul(
          percent / 100,
        ),
      }
    }

    if (!liquidityEntity) {
      return {
        runeAmount: Amount.fromMidgard(0),
        assetAmount: Amount.fromMidgard(0),
      }
    }

    if (withdrawType === LiquidityTypeOption.SYMMETRICAL) {
      return liquidityEntity.getSymWithdrawAmount(
        new Percent(percent, AmountType.BASE_AMOUNT),
      )
    }

    if (withdrawType === LiquidityTypeOption.RUNE) {
      const amount = liquidityEntity.getAsymRuneWithdrawAmount(
        new Percent(percent, AmountType.BASE_AMOUNT),
      )

      return {
        runeAmount: amount,
        assetAmount: Amount.fromMidgard(0),
      }
    }

    const amount = liquidityEntity.getAsymAssetWithdrawAmount(
      new Percent(percent, AmountType.BASE_AMOUNT),
    )

    return {
      runeAmount: Amount.fromMidgard(0),
      assetAmount: amount,
    }
  }, [lpType, withdrawType, percent, liquidityEntity, memberPoolData])

  const runePriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  )

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: pool.asset,
        pools,
        priceAmount: assetAmount,
      }),
    [pool, assetAmount, pools],
  )

  const handleSetLPType = useCallback((type: PoolShareType) => {
    setLPType(type)
    if (type === PoolShareType.RUNE_ASYM) {
      setWithdrawType(LiquidityTypeOption.RUNE)
    } else if (type === PoolShareType.ASSET_ASYM) {
      setWithdrawType(LiquidityTypeOption.ASSET)
    } else {
      setWithdrawType(LiquidityTypeOption.SYMMETRICAL)
    }
  }, [])

  const handleChangePercent = useCallback((p: Amount) => {
    setPercent(Number(p.toFixed(2)))
  }, [])

  const handleConfirmWithdraw = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet) {
      const poolAssetString = pool.asset.toString()
      let trackId = ''
      try {
        if (lpType === PoolShareType.SYM) {
          if (withdrawType === LiquidityTypeOption.SYMMETRICAL) {
            const outAssets = [
              {
                asset: Asset.RUNE().toString(),
                amount: runeAmount.toSignificant(6),
              },
              {
                asset: pool.asset.toString(),
                amount: assetAmount.toSignificant(6),
              },
            ]

            // register to tx tracker
            trackId = submitTransaction({
              type: TxTrackerType.Withdraw,
              submitTx: {
                inAssets: [],
                outAssets,
                poolAsset: poolAssetString,
              },
            })

            const txID = await multichain.withdraw({
              pool,
              percent: new Percent(percent),
              from: 'sym',
              to: 'sym',
            })
            console.info('txID', txID)

            // start polling
            pollTransaction({
              type: TxTrackerType.Withdraw,
              uuid: trackId,
              submitTx: {
                inAssets: [],
                outAssets,
                poolAsset: poolAssetString,
                txID,
                withdrawChain: Chain.THORChain,
              },
            })
          } else if (withdrawType === LiquidityTypeOption.RUNE) {
            const outAssets = [
              {
                asset: Asset.RUNE().toString(),
                amount: runeAmount.toSignificant(6),
              },
            ]

            // register to tx tracker
            trackId = submitTransaction({
              type: TxTrackerType.Withdraw,
              submitTx: {
                inAssets: [],
                outAssets,
                poolAsset: poolAssetString,
              },
            })

            const txID = await multichain.withdraw({
              pool,
              percent: new Percent(percent),
              from: 'sym',
              to: 'rune',
            })
            console.info('txID', txID)

            // start polling
            pollTransaction({
              type: TxTrackerType.Withdraw,
              uuid: trackId,
              submitTx: {
                inAssets: [],
                outAssets,
                txID,
                poolAsset: poolAssetString,
                withdrawChain: Chain.THORChain,
              },
            })
          } else if (withdrawType === LiquidityTypeOption.ASSET) {
            const outAssets = [
              {
                asset: pool.asset.toString(),
                amount: assetAmount.toSignificant(6),
              },
            ]

            // register to tx tracker
            trackId = submitTransaction({
              type: TxTrackerType.Withdraw,
              submitTx: {
                inAssets: [],
                outAssets,
                poolAsset: poolAssetString,
              },
            })

            const txID = await multichain.withdraw({
              pool,
              percent: new Percent(percent),
              from: 'sym',
              to: 'asset',
            })
            console.info('txID', txID)

            // start polling
            pollTransaction({
              type: TxTrackerType.Withdraw,
              uuid: trackId,
              submitTx: {
                inAssets: [],
                outAssets,
                txID,
                poolAsset: poolAssetString,
                withdrawChain: Chain.THORChain,
              },
            })
          }
        } else if (lpType === PoolShareType.ASSET_ASYM) {
          const outAssets = [
            {
              asset: pool.asset.toString(),
              amount: assetAmount.toSignificant(6),
            },
          ]

          // register to tx tracker
          trackId = submitTransaction({
            type: TxTrackerType.Withdraw,
            submitTx: {
              inAssets: [],
              outAssets,
              poolAsset: poolAssetString,
            },
          })

          const txID = await multichain.withdraw({
            pool,
            percent: new Percent(percent),
            from: 'asset',
            to: 'asset',
          })

          console.info('txID', txID)

          // start polling
          pollTransaction({
            type: TxTrackerType.Withdraw,
            uuid: trackId,
            submitTx: {
              inAssets: [],
              outAssets,
              txID,
              poolAsset: poolAssetString,
              withdrawChain: pool.asset.chain,
            },
          })
        } else if (lpType === PoolShareType.RUNE_ASYM) {
          const outAssets = [
            {
              asset: Asset.RUNE().toString(),
              amount: runeAmount.toSignificant(6),
            },
          ]

          // register to tx tracker
          trackId = submitTransaction({
            type: TxTrackerType.Withdraw,
            submitTx: {
              inAssets: [],
              outAssets,
              poolAsset: poolAssetString,
            },
          })

          const txID = await multichain.withdraw({
            pool,
            percent: new Percent(percent),
            from: 'rune',
            to: 'rune',
          })

          console.info('txID', txID)

          // start polling
          pollTransaction({
            type: TxTrackerType.Withdraw,
            uuid: trackId,
            submitTx: {
              inAssets: [],
              outAssets,
              txID,
              poolAsset: poolAssetString,
              withdrawChain: Chain.THORChain,
            },
          })
        }
      } catch (error: NotWorth) {
        console.error(error)
        setTxFailed(trackId)

        // TODO: better error translation
        // const description = translateErrorMsg(error?.toString())
        showToast(
          {
            message: t('notification.submitTxFailed'),
            description: error?.toString(),
          },
          ToastType.Error,
        )
      }
    }
  }, [
    withdrawType,
    lpType,
    wallet,
    pool,
    percent,
    runeAmount,
    assetAmount,
    submitTransaction,
    pollTransaction,
    setTxFailed,
  ])

  const handleWithdrawLiquidity = useCallback(() => {
    if (pool.asset.isETH() && pool.detail.status === 'staged') {
      showToast(
        {
          message: t('notification.cannotWithdrawFromSP'),
          description: t('notification.cannotWithdrawFromSPDesc'),
        },
        ToastType.Info,
      )
      return
    }

    if (wallet) {
      setVisibleConfirmModal(true)
    } else {
      showToast(
        {
          message: t('notification.walletNotFound'),
          description: t('notification.connectWallet'),
        },
        ToastType.Info,
      )
    }
  }, [wallet, pool])

  const title = useMemo(
    () =>
      `${t('common.withdraw')} ${poolAsset.ticker} ${t('common.liquidity')}`,
    [poolAsset],
  )

  const withdrawOptions = useMemo(() => {
    // allow only sym withdraw for staged pools
    const isStaged = pool.detail.status === 'staged'
    const isPendingLP = lpType === PoolShareType.PENDING

    if (isStaged || isPendingLP) {
      return [LiquidityTypeOption.SYMMETRICAL]
    }

    if (lpType === PoolShareType.RUNE_ASYM) return [LiquidityTypeOption.RUNE]
    if (lpType === PoolShareType.ASSET_ASYM) return [LiquidityTypeOption.ASSET]

    return [
      LiquidityTypeOption.ASSET,
      LiquidityTypeOption.SYMMETRICAL,
      LiquidityTypeOption.RUNE,
    ]
  }, [lpType, pool.detail.status])

  const withdrawAssets = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.RUNE) {
      return [
        {
          asset: Asset.RUNE(),
          value: `${runeAmount.toSignificant(
            6,
          )} RUNE (${runePriceInUSD.toCurrencyFormat(2)})`,
        },
      ]
    }

    if (withdrawType === LiquidityTypeOption.ASSET) {
      return [
        {
          asset: poolAsset,
          value: `${assetAmount.toSignificant(6)} ${
            poolAsset.ticker
          } (${assetPriceInUSD.toCurrencyFormat(2)})`,
        },
      ]
    }

    return [
      {
        asset: Asset.RUNE(),
        value: `${runeAmount.toSignificant(
          6,
        )} RUNE (${runePriceInUSD.toCurrencyFormat(2)})`,
      },
      {
        asset: poolAsset,
        value: `${assetAmount.toSignificant(6)} ${
          poolAsset.ticker
        } (${assetPriceInUSD.toCurrencyFormat(2)})`,
      },
    ]
  }, [
    withdrawType,
    runeAmount,
    assetAmount,
    poolAsset,
    runePriceInUSD,
    assetPriceInUSD,
  ])

  const confirmInfo = useConfirmInfoItems({
    assets: withdrawAssets,
    fee: feeLabel,
  })

  const renderConfirmModalContent = useMemo(
    () => <InfoTable items={confirmInfo} />,
    [confirmInfo],
  )

  return (
    <PanelView
      title={t('views.liquidity.withdrawLiquidity')}
      header={
        <ViewHeader
          withBack
          title={title}
          actionsComponent={<GlobalSettingsPopover />}
        />
      }
    >
      <LiquidityType
        poolAsset={poolAsset}
        selected={withdrawType}
        options={withdrawOptions}
        onChange={setWithdrawType}
        title={`${t('views.liquidity.withdraw')}:`}
      />

      <LPTypeSelector
        poolAsset={poolAsset}
        selected={lpType}
        options={shareTypes}
        onChange={handleSetLPType}
        title={`${t('views.liquidity.from')}:`}
      />
      <AssetInputs
        poolAsset={poolAsset}
        runeAmount={runeAmount}
        assetAmount={assetAmount}
        percent={Amount.fromNormalAmount(percent)}
        onPercentChange={handleChangePercent}
        liquidityType={withdrawType}
      />

      {poolAsset.chain === Chain.Terra && <TerraAsymWithdrawInfo />}

      <Box className="w-full pt-4">
        <InfoTable horizontalInset items={confirmInfo} />
      </Box>

      <Box className="self-stretch gap-4 pt-5">
        {isWalletConnected && !isLPActionPaused && (
          <Button
            size="lg"
            stretch
            variant="secondary"
            onClick={handleWithdrawLiquidity}
          >
            {t('common.withdraw')}
          </Button>
        )}
        {!isWalletConnected && (
          <Button
            size="lg"
            isFancy
            stretch
            variant="secondary"
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        )}
        {isLPActionPaused && (
          <Button size="lg" stretch variant="secondary">
            Withdraw Not Available
          </Button>
        )}
      </Box>

      <ConfirmModal
        inputAssets={[sendAsset]}
        isOpened={visibleConfirmModal}
        onConfirm={handleConfirmWithdraw}
        onClose={() => setVisibleConfirmModal(false)}
      >
        {renderConfirmModalContent}
      </ConfirmModal>
    </PanelView>
  )
}

export default WithdrawLiquidity
