import { useCallback, useMemo, useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { MemberPool } from '@thorswap-lib/midgard-sdk'
import {
  getInputAssetsForAdd,
  Amount,
  Asset,
  getAssetBalance,
  Pool,
  Price,
  Liquidity,
  AssetAmount,
  Percent,
  SupportedChain,
  hasConnectedWallet,
  hasWalletConnected,
  getEstimatedTxTime,
  AddLiquidityTxns,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import { ADD_LIQUIDITY_GUIDE_URL } from 'config/constants'

import { Button, Box, Link } from 'components/Atomic'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { InfoTable } from 'components/InfoTable'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems'
import { PanelView } from 'components/PanelView'
import { showErrorToast, showInfoToast } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { useApp } from 'store/app/hooks'
import { useExternalConfig } from 'store/externalConfig/hooks'
import * as actions from 'store/midgard/actions'
import { useMidgard } from 'store/midgard/hooks'
import { TxTrackerStatus, TxTrackerType } from 'store/midgard/types'
import { isPendingLP } from 'store/midgard/utils'
import { useAppDispatch, useAppSelector } from 'store/store'
import { useWallet } from 'store/wallet/hooks'

import { useApprove } from 'hooks/useApprove'
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance'
import { useBalance } from 'hooks/useBalance'
import { useMimir } from 'hooks/useMimir'
import { useNetworkFee, getSumAmountInUSD } from 'hooks/useNetworkFee'
import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { translateErrorMsg } from 'helpers/error'

import { getAddLiquidityRoute } from 'settings/constants'

import { AssetInputs } from './AssetInputs'
import { PoolInfo } from './PoolInfo'
import { useConfirmInfoItems } from './useConfirmInfoItems'
import { getMaxSymAmounts, liquidityToPoolShareType } from './utils'

// TODO: refactor useState -> useReducer
export const AddLiquidity = () => {
  const navigate = useNavigate()
  const { assetParam = Asset.BTC().toString() } = useParams<{
    assetParam: string
  }>()

  const { expertMode } = useApp()

  const [liquidityType, setLiquidityType] = useState(
    LiquidityTypeOption.SYMMETRICAL,
  )

  const [poolAsset, setPoolAsset] = useState<Asset>(Asset.BTC())
  const [pool, setPool] = useState<Pool>()

  const { getAllMemberDetails } = useMidgard()
  const { pools, poolLoading, chainMemberDetailsLoading, chainMemberDetails } =
    useAppSelector(({ midgard }) => midgard)
  const dispatch = useAppDispatch()

  ///
  const { getMaxBalance, isWalletAssetConnected } = useBalance()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { isFundsCapReached, isChainPauseLPAction } = useMimir()
  const { getChainDepositLPPaused } = useExternalConfig()

  useEffect(() => {
    getAllMemberDetails()
  }, [getAllMemberDetails])

  const poolAssets = useMemo(() => {
    const assets = pools.map((poolData) => poolData.asset)
    return assets
  }, [pools])

  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) ||
      getChainDepositLPPaused(poolAsset.chain as SupportedChain)
    )
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused])

  const loadMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) return
      const assetChainAddress = wallet?.[chain]?.address
      const thorchainAddress = wallet?.[Chain.THORChain]?.address

      if (assetChainAddress && thorchainAddress) {
        dispatch(
          actions.reloadPoolMemberDetailByChain({
            chain,
            thorchainAddress,
            assetChainAddress,
          }),
        )
      }
    },
    [dispatch, wallet],
  )

  useEffect(() => {
    if (!assetParam) return

    const assetEntity = Asset.decodeFromURL(assetParam)

    if (wallet && assetEntity) {
      loadMemberDetailsByChain(assetEntity?.chain as SupportedChain)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, assetParam])

  useEffect(() => {
    if (!poolLoading && pools.length && poolAsset) {
      const assetPool = Pool.byAsset(poolAsset, pools)

      if (assetPool) {
        setPool(assetPool)
      }
    }
  }, [pools, poolLoading, poolAsset])

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return
      }

      const assetEntity = Asset.decodeFromURL(assetParam)

      if (assetEntity) {
        if (assetEntity.isRUNE()) return

        await assetEntity.setDecimal()

        setPoolAsset(assetEntity)
      }
    }

    getAssetEntity()
  }, [assetParam])

  const isMemberLoading = useMemo(() => {
    if (!wallet || !assetParam) return false

    const assetEntity = Asset.decodeFromURL(assetParam)

    if (assetEntity) {
      return chainMemberDetailsLoading?.[assetEntity?.chain] === true
    }

    return false
  }, [wallet, chainMemberDetailsLoading, assetParam])

  const chainMemberData = useMemo(() => {
    if (pool && pools.length && poolAsset && !isMemberLoading) {
      return chainMemberDetails?.[poolAsset.chain]
    }
    return null
  }, [chainMemberDetails, poolAsset, pool, pools, isMemberLoading])

  const memberData = useMemo(() => {
    if (pool && pools.length && poolAsset && !isMemberLoading) {
      return chainMemberData?.[pool.asset.toString()]
    }
    return null
  }, [chainMemberData, poolAsset, pool, pools, isMemberLoading])

  const inputAssets = useMemo(() => {
    if (
      hasConnectedWallet(wallet) &&
      liquidityType !== LiquidityTypeOption.RUNE
    ) {
      return getInputAssetsForAdd({ wallet, pools })
    }

    return poolAssets
  }, [wallet, pools, poolAssets, liquidityType])

  const isSymDeposit = useMemo(
    () => liquidityType === LiquidityTypeOption.SYMMETRICAL && !expertMode,
    [liquidityType, expertMode],
  )

  const [assetAmount, setAssetAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )
  const [runeAmount, setRuneAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )

  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleApproveModal, setVisibleApproveModal] = useState(false)
  const [asymmTipVisible, setAsymmTipVisible] = useState(true)
  const [existingLPTipVisible, setExistingLPTipVisible] = useState(true)

  const { inboundFee: inboundAssetFee } = useNetworkFee({
    inputAsset: poolAsset,
  })

  const { inboundFee: inboundRuneFee } = useNetworkFee({
    inputAsset: Asset.RUNE(),
  })

  const poolMemberDetail: MemberPool | undefined = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      if (memberData?.pending) return memberData.pending
      return memberData?.sym
    }
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return memberData?.runeAsym
    }

    return memberData?.assetAsym
  }, [memberData, liquidityType])

  // if pending LP exists, only allow complete deposit
  const isPendingDeposit = useMemo(() => {
    if (
      liquidityType === LiquidityTypeOption.SYMMETRICAL &&
      poolMemberDetail &&
      isPendingLP(poolMemberDetail)
    ) {
      return true
    }
    return false
  }, [liquidityType, poolMemberDetail])

  const isAssetPending: boolean = useMemo(() => {
    return (
      isPendingDeposit &&
      Amount.fromMidgard(poolMemberDetail?.assetPending ?? 0).gt(0)
    )
  }, [isPendingDeposit, poolMemberDetail])

  const isRunePending: boolean = useMemo(() => {
    return (
      isPendingDeposit &&
      Amount.fromMidgard(poolMemberDetail?.runePending ?? 0).gt(0)
    )
  }, [isPendingDeposit, poolMemberDetail])

  const liquidityUnits = useMemo(() => {
    if (!poolMemberDetail) return Amount.fromMidgard(0)

    return Amount.fromMidgard(poolMemberDetail.liquidityUnits)
  }, [poolMemberDetail])

  const liquidityEntity = useMemo(() => {
    if (!pool) return null
    return new Liquidity(pool, liquidityUnits)
  }, [pool, liquidityUnits])

  const addLiquiditySlip = useMemo(() => {
    if (!liquidityEntity) return null
    return (
      liquidityEntity.getLiquiditySlip(runeAmount, assetAmount) as Percent
    ).toFixed(2)
  }, [liquidityEntity, assetAmount, runeAmount])

  const poolShareEst = useMemo(() => {
    if (!liquidityEntity) return null
    return liquidityEntity.getPoolShareEst(runeAmount, assetAmount).toFixed(3)
  }, [liquidityEntity, assetAmount, runeAmount])

  const isWalletConnected = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.ASSET) {
      return hasWalletConnected({ wallet, inputAssets: [poolAsset] })
    }
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] })
    }

    // symm
    return (
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] })
    )
  }, [wallet, poolAsset, liquidityType])

  const { isApproved, assetApproveStatus } = useApprove(
    poolAsset,
    isWalletConnected,
  )

  const poolAssetPriceInUSD = useMemo(() => {
    if (isAssetPending && poolMemberDetail) {
      return new Price({
        baseAsset: poolAsset,
        pools,
        priceAmount: Amount.fromMidgard(poolMemberDetail.assetPending),
      })
    }
    return new Price({
      baseAsset: poolAsset,
      pools,
      priceAmount: assetAmount,
    })
  }, [poolAsset, assetAmount, pools, isAssetPending, poolMemberDetail])

  const runeAssetPriceInUSD = useMemo(() => {
    if (isRunePending && poolMemberDetail) {
      return new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: Amount.fromMidgard(poolMemberDetail.runePending),
      })
    }
    new Price({
      baseAsset: Asset.RUNE(),
      pools,
      priceAmount: runeAmount,
    })
  }, [runeAmount, pools, isRunePending, poolMemberDetail])

  const poolAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset, wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [poolAsset, wallet])

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  )

  const runeBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(Asset.RUNE(), wallet).amount
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8)
  }, [wallet])

  const maxRuneBalance: Amount = useMemo(
    () => getMaxBalance(Asset.RUNE()),
    [getMaxBalance],
  )

  const { maxSymAssetAmount, maxSymRuneAmount } = useMemo(() => {
    if (!pool) {
      return {
        maxSymAssetAmount: Amount.fromAssetAmount(0, 8),
        maxSymRuneAmount: Amount.fromAssetAmount(0, 8),
      }
    }

    if (isAssetPending && poolMemberDetail) {
      return getMaxSymAmounts({
        runeAmount: maxRuneBalance,
        assetAmount: Amount.fromMidgard(poolMemberDetail?.assetPending),
        pool,
      })
    }

    if (isRunePending && poolMemberDetail) {
      return getMaxSymAmounts({
        runeAmount: Amount.fromMidgard(poolMemberDetail?.runePending),
        assetAmount: maxPoolAssetBalance,
        pool,
      })
    }

    return getMaxSymAmounts({
      runeAmount: maxRuneBalance,
      assetAmount: maxPoolAssetBalance,
      pool,
    })
  }, [
    pool,
    maxRuneBalance,
    maxPoolAssetBalance,
    isAssetPending,
    poolMemberDetail,
    isRunePending,
  ])

  const handleSelectLiquidityType = useCallback((type: LiquidityTypeOption) => {
    if (type === LiquidityTypeOption.ASSET) {
      setRuneAmount(Amount.fromAssetAmount(0, 8))
    } else if (type === LiquidityTypeOption.RUNE) {
      setAssetAmount(Amount.fromAssetAmount(0, 8))
    }

    setLiquidityType(type)
  }, [])

  const handleSelectPoolAsset = useCallback(
    (poolAssetData: Asset) => {
      navigate(getAddLiquidityRoute(poolAssetData))
    },
    [navigate],
  )

  const handleChangeAssetAmount = useCallback(
    (amount: Amount) => {
      if (!pool) {
        setAssetAmount(amount)
        return
      }

      const maxAmount = isSymDeposit ? maxSymAssetAmount : maxPoolAssetBalance

      if (amount.gt(maxAmount)) {
        setAssetAmount(maxAmount)

        if (isSymDeposit) {
          setRuneAmount(maxAmount.mul(pool.assetPriceInRune))
        }
      } else {
        setAssetAmount(amount)

        if (isSymDeposit) {
          setRuneAmount(amount.mul(pool.assetPriceInRune))
        }
      }
    },
    [maxSymAssetAmount, maxPoolAssetBalance, pool, isSymDeposit],
  )

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (!pool) {
        setRuneAmount(amount)
        return
      }

      const maxAmount = isSymDeposit ? maxSymRuneAmount : maxRuneBalance
      if (amount.gt(maxAmount)) {
        setRuneAmount(maxAmount)

        if (isSymDeposit) {
          setAssetAmount(maxAmount.mul(pool.runePriceInAsset))
        }
      } else {
        setRuneAmount(amount)
        if (isSymDeposit) {
          setAssetAmount(amount.mul(pool.runePriceInAsset))
        }
      }
    },
    [maxSymRuneAmount, maxRuneBalance, pool, isSymDeposit],
  )

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false)
    if (wallet && pool) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? new AssetAmount(Asset.RUNE(), runeAmount)
          : undefined
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? new AssetAmount(poolAsset, assetAmount)
          : undefined

      const inAssets = []

      // if rune is pending, don't deposit rune
      if (liquidityType !== LiquidityTypeOption.ASSET && !isRunePending) {
        inAssets.push({
          asset: Asset.RUNE().toString(),
          amount: runeAmount.toSignificant(6),
        })
      }

      // if asset is pending, dont deposit asset
      if (liquidityType !== LiquidityTypeOption.RUNE && !isAssetPending) {
        inAssets.push({
          asset: poolAsset.toString(),
          amount: assetAmount.toSignificant(6),
        })
      }

      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.AddLiquidity,
        submitTx: {
          inAssets,
          outAssets: [],
          poolAsset: poolAsset.ticker,
        },
      })

      try {
        let txRes: AddLiquidityTxns = {
          runeTx: '#',
          assetTx: '#',
        }
        if (isAssetPending) {
          // deposit only rune if asset is pending
          // NOTE: important to pass sym_rune and asset address param
          txRes = await multichain.addLiquidity(
            {
              pool,
              runeAmount: runeAssetAmount,
              assetAmount: undefined,
              runeAddr: poolMemberDetail?.runeAddress,
              assetAddr: poolMemberDetail?.assetAddress,
            },
            'sym_rune',
          )
        } else if (isRunePending) {
          // deposit only rune if asset is pending
          // NOTE: important to pass sym_asset and rune address param
          txRes = await multichain.addLiquidity(
            {
              pool,
              runeAmount: undefined,
              assetAmount: poolAssetAmount,
              runeAddr: poolMemberDetail?.runeAddress,
              assetAddr: poolMemberDetail?.assetAddress,
            },
            'sym_asset',
          )
        } else {
          // no pending
          txRes = await multichain.addLiquidity({
            pool,
            runeAmount: runeAssetAmount,
            assetAmount: poolAssetAmount,
          })
        }

        const runeTxHash = txRes?.runeTx
        const assetTxHash = txRes?.assetTx

        console.info('runeTxHash', runeTxHash)
        console.info('assetTxHash', assetTxHash)

        if (runeTxHash || assetTxHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.AddLiquidity,
            uuid: trackId,
            submitTx: {
              inAssets,
              outAssets: [],
              txID: runeTxHash || assetTxHash,
              addTx: {
                runeTxID: runeTxHash,
                assetTxID: assetTxHash,
              },
              poolAsset: poolAsset.ticker,
            },
          })
        }
      } catch (error: NotWorth) {
        setTxFailed(trackId)

        const description = translateErrorMsg(error?.toString())
        showErrorToast(t('notification.submitFail'), description)
        console.error(error)
      }
    }
  }, [
    poolMemberDetail,
    isAssetPending,
    isRunePending,
    wallet,
    pool,
    poolAsset,
    runeAmount,
    assetAmount,
    liquidityType,
    submitTransaction,
    pollTransaction,
    setTxFailed,
  ])

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false)

    if (isWalletAssetConnected(poolAsset)) {
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx: {
          inAssets: [
            {
              asset: poolAsset.toString(),
              amount: '0', // not needed for approve tx
            },
          ],
        },
      })

      try {
        const txHash = await multichain.approveAsset(poolAsset)

        if (txHash) {
          const txURL = multichain.getExplorerTxUrl(poolAsset.chain, txHash)

          console.info('txURL', txURL)
          if (txHash) {
            // start polling
            pollTransaction({
              type: TxTrackerType.Approve,
              uuid: trackId,
              submitTx: {
                inAssets: [
                  {
                    asset: poolAsset.toString(),
                    amount: '0', // not needed for approve tx
                  },
                ],
                txID: txHash,
              },
            })
          }
        }
      } catch (error) {
        setTxFailed(trackId)

        showErrorToast(t('notification.approveFailed'))
      }
    }
  }, [
    poolAsset,
    isWalletAssetConnected,
    pollTransaction,
    setTxFailed,
    submitTransaction,
  ])

  const handleAddLiquidity = useCallback(() => {
    if (!isWalletConnected) {
      return showInfoToast(
        t('notification.walletNotFound'),
        t('notification.connectWallet'),
      )
    }

    if (isFundsCapReached) {
      return showInfoToast(
        t('notification.fundsCapReached'),
        t('notification.fundsCapReachedDesc'),
      )
    }

    setVisibleConfirmModal(true)
  }, [isWalletConnected, isFundsCapReached])

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true)
    } else {
      showInfoToast(
        t('notification.walletNotFound'),
        t('notification.connectWallet'),
      )
    }
  }, [wallet])

  const totalFeeInUSD = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      const totalFee = getSumAmountInUSD(inboundRuneFee, inboundAssetFee, pools)

      return `$${totalFee}`
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return inboundAssetFee
        .totalPriceIn(Asset.USD(), pools)
        .toCurrencyFormat(2)
    }

    // Rune asym
    return inboundRuneFee.totalPriceIn(Asset.USD(), pools).toCurrencyFormat(2)
  }, [liquidityType, inboundRuneFee, inboundAssetFee, pools])

  const depositAssets: Asset[] = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [Asset.RUNE()]
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [poolAsset]
    }

    return [poolAsset, Asset.RUNE()]
  }, [liquidityType, poolAsset])

  const depositAssetInputs = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [
        {
          asset: Asset.RUNE(),
          value: runeAmount.toSignificant(6),
        },
      ]
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [
        {
          asset: poolAsset,
          value: assetAmount.toSignificant(6),
        },
      ]
    }

    return [
      {
        asset: Asset.RUNE(),
        value: runeAmount.toSignificant(6),
      },
      {
        asset: poolAsset,
        value: assetAmount.toSignificant(6),
      },
    ]
  }, [liquidityType, poolAsset, assetAmount, runeAmount])

  const minRuneAmount: Amount = useMemo(
    () => AssetAmount.getMinAmountByChain(Chain.THORChain).amount,
    [],
  )
  const minAssetAmount: Amount = useMemo(() => {
    if (poolAsset.isGasAsset()) {
      return AssetAmount.getMinAmountByChain(poolAsset.chain)
    }

    return Amount.fromAssetAmount(0, 8)
  }, [poolAsset])

  const isValidDeposit: {
    valid: boolean
    msg?: string
  } = useMemo(() => {
    if (isLPActionPaused) {
      return {
        valid: false,
        msg: t('notification.notAvailableDeposit'),
      }
    }
    // only invalid scenario is
    // 1. rune asym
    // 2. rune-asset sym

    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      if (!runeAmount.gt(minRuneAmount) || !assetAmount.gt(minAssetAmount)) {
        return {
          valid: false,
          msg: t('notification.invalidAmount'),
        }
      }

      if (poolMemberDetail && !isPendingLP(poolMemberDetail)) {
        // if runeAsym or assetAsym already exist, cannot deposit symmetrically
        if (memberData?.runeAsym) {
          return {
            valid: false,
            msg: t('notification.alreadyHaveRune'),
          }
        }
      }
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      if (!assetAmount.gt(minAssetAmount)) {
        return {
          valid: false,
          msg: t('notification.insufficientAmount'),
        }
      }
    }

    if (liquidityType === LiquidityTypeOption.RUNE) {
      if (!runeAmount.gt(minRuneAmount)) {
        return {
          valid: false,
          msg: t('notification.insufficientAmount'),
        }
      }
    }

    return { valid: true }
  }, [
    poolMemberDetail,
    isLPActionPaused,
    liquidityType,
    runeAmount,
    assetAmount,
    minRuneAmount,
    minAssetAmount,
    memberData,
  ])

  const isApproveRequired = useMemo(() => {
    if (
      liquidityType !== LiquidityTypeOption.RUNE &&
      isApproved !== null &&
      !isApproved
    ) {
      return true
    }

    return false
  }, [isApproved, liquidityType])

  const poolAssetInput = useMemo(() => {
    if (isAssetPending && poolMemberDetail) {
      return {
        asset: poolAsset,
        value: Amount.fromMidgard(poolMemberDetail.assetPending),
        balance: poolAssetBalance,
        usdPrice: poolAssetPriceInUSD,
      }
    }
    return {
      asset: poolAsset,
      value: assetAmount,
      balance: poolAssetBalance,
      usdPrice: poolAssetPriceInUSD,
    }
  }, [
    poolAsset,
    assetAmount,
    poolAssetBalance,
    poolAssetPriceInUSD,
    isAssetPending,
    poolMemberDetail,
  ])

  const runeAssetInput = useMemo(() => {
    if (isRunePending && poolMemberDetail) {
      return {
        asset: Asset.RUNE(),
        value: Amount.fromMidgard(poolMemberDetail.runePending),
        balance: runeBalance,
        usdPrice: runeAssetPriceInUSD,
      }
    }
    return {
      asset: Asset.RUNE(),
      value: runeAmount,
      balance: runeBalance,
      usdPrice: runeAssetPriceInUSD,
    }
  }, [
    runeAmount,
    runeBalance,
    runeAssetPriceInUSD,
    isRunePending,
    poolMemberDetail,
  ])

  const poolAssetList = useAssetsWithBalance(inputAssets)

  const title = useMemo(() => `Add ${poolAsset.ticker} Liquidity`, [poolAsset])

  const btnLabel = useMemo(() => {
    if (!isValidDeposit.valid) return isValidDeposit.msg

    if (isApproveRequired) return 'Add'

    return 'Add Liquidity'
  }, [isValidDeposit, isApproveRequired])

  const estimatedTime = useMemo(() => {
    const isRuneLiquidity = liquidityType === LiquidityTypeOption.RUNE

    return getEstimatedTxTime({
      amount: isRuneLiquidity ? runeAmount : assetAmount,
      chain: isRuneLiquidity
        ? Chain.THORChain
        : (poolAsset.chain as SupportedChain),
    })
  }, [liquidityType, assetAmount, runeAmount, poolAsset])

  const confirmInfo = useConfirmInfoItems({
    assets: depositAssetInputs,
    poolShare: poolShareEst,
    slippage: addLiquiditySlip || 'N/A',
    estimatedTime,
    totalFee: totalFeeInUSD,
    fees: [
      { chain: poolAsset.L1Chain, fee: inboundAssetFee.toCurrencyFormat() },
      { chain: Chain.THORChain, fee: inboundRuneFee.toCurrencyFormat() },
    ],
  })

  const approveConfirmInfo = useApproveInfoItems({
    inputAsset: {
      asset: poolAsset,
      value: assetAmount,
    },
    fee: inboundAssetFee.toCurrencyFormat(),
  })

  const isDepositAvailable = useMemo(
    () => isWalletConnected && !isApproveRequired,
    [isWalletConnected, isApproveRequired],
  )

  const currentAssetHaveLP: boolean = useMemo(() => {
    const lpPositions = Object.keys(chainMemberDetails)
    return lpPositions.includes(poolAsset.symbol)
  }, [chainMemberDetails, poolAsset])

  return (
    <PanelView
      title={title}
      header={
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<GlobalSettingsPopover transactionMode />}
        />
      }
    >
      <LiquidityType
        poolAsset={poolAsset}
        selected={liquidityType}
        onChange={handleSelectLiquidityType}
        options={[
          LiquidityTypeOption.ASSET,
          LiquidityTypeOption.SYMMETRICAL,
          LiquidityTypeOption.RUNE,
        ]}
      />

      <AssetInputs
        poolAsset={poolAssetInput}
        runeAsset={runeAssetInput}
        poolAssetList={poolAssetList}
        onAssetAmountChange={handleChangeAssetAmount}
        onRuneAmountChange={handleChangeRuneAmount}
        onPoolChange={handleSelectPoolAsset}
        liquidityType={liquidityType}
        isAssetPending={isAssetPending}
        isRunePending={isRunePending}
      />

      <PoolInfo
        poolTicker={poolAssetInput.asset.ticker}
        runeTicker={runeAssetInput.asset.ticker}
        fee={totalFeeInUSD}
        slippage={addLiquiditySlip}
        poolShare={poolShareEst}
        rate={pool?.assetPriceInRune?.toSignificant(6) ?? null}
      />

      {poolMemberDetail && pool && (
        <LiquidityCard
          {...poolMemberDetail}
          pool={pool}
          shareType={liquidityToPoolShareType(liquidityType)}
        />
      )}

      {[LiquidityTypeOption.ASSET, LiquidityTypeOption.RUNE].includes(
        liquidityType,
      ) &&
        asymmTipVisible && (
          <InfoTip
            title={t('views.addLiquidity.asymmetricPoolTip')}
            content={
              <>
                {`${t('views.addLiquidity.asymmetricPoolNotice0', {
                  depositAsset:
                    liquidityType === LiquidityTypeOption.ASSET
                      ? poolAsset.ticker
                      : Asset.RUNE(),
                  asset: poolAsset.ticker,
                })} `}
                <Link className="text-chain-terra" to={ADD_LIQUIDITY_GUIDE_URL}>
                  {t('common.learnMore')}
                </Link>
              </>
            }
            onClose={() => setAsymmTipVisible(false)}
            type="warn"
          />
        )}

      {currentAssetHaveLP && existingLPTipVisible && (
        <InfoTip
          className="w-full mt-0 mb-4"
          title={t('views.addLiquidity.existingLpTip')}
          content={
            <>
              {t('views.addLiquidity.existingLpTipNotice')}
              <Link className="text-chain-terra" to={ADD_LIQUIDITY_GUIDE_URL}>
                {' '}
                {t('common.learnMore')}
              </Link>
            </>
          }
          onClose={() => setExistingLPTipVisible(false)}
          type="warn"
        />
      )}

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button
            stretch
            size="lg"
            isFancy
            onClick={handleApprove}
            loading={[
              TxTrackerStatus.Pending,
              TxTrackerStatus.Submitting,
            ].includes(assetApproveStatus)}
          >
            Approve
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            stretch
            size="lg"
            isFancy
            disabled={!isValidDeposit.valid}
            error={!isValidDeposit.valid}
            onClick={handleAddLiquidity}
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button
            isFancy
            stretch
            size="lg"
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onConfirm={handleConfirmAdd}
        onClose={() => setVisibleConfirmModal(false)}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>

      <ConfirmModal
        inputAssets={[poolAsset]}
        isOpened={visibleApproveModal}
        onClose={() => setVisibleApproveModal(false)}
        onConfirm={handleConfirmApprove}
      >
        <InfoTable items={approveConfirmInfo} />
      </ConfirmModal>
    </PanelView>
  )
}

export default AddLiquidity
