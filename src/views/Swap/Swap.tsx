import { useCallback, useMemo, useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router'

import {
  getInputAssets,
  Amount,
  Asset,
  AssetAmount,
  getWalletAddressByChain,
  Swap,
  Percent,
  Price,
  getEstimatedTxTime,
  SupportedChain,
  hasWalletConnected,
  hasConnectedWallet,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import copy from 'copy-to-clipboard'

import { Button, Icon, Box } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { InfoTable } from 'components/InfoTable'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { useConfirmInfoItems } from 'components/Modals/ConfirmModal/useConfirmInfoItems'
import { PanelInput, PanelInputTitle } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useApp } from 'redux/app/hooks'
import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'
// import { useAssets } from 'redux/assets/hooks'

// import { TxTrackerStatus, TxTrackerType } from 'redux/midgard/types'
// import { useApprove } from 'hooks/useApprove'

import { useBalance } from 'hooks/useBalance'
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB'
import { useNetworkFee } from 'hooks/useNetworkFee'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

// import { translateErrorMsg } from 'helpers/error'
// import { truncateAddress } from 'helpers/string'

import { IS_SYNTH_ACTIVE } from 'settings/config'
import {
  getPoolDetailRouteFromAsset,
  getSwapRoute,
  navigateToExternalLink,
} from 'settings/constants'

import { AssetInputs } from './AssetInputs'
import { SwapInfo } from './SwapInfo'
import { Pair } from './types'
import { getSwapPair } from './utils'

const SwapView = () => {
  const navigate = useNavigate()
  const { pair } = useParams<{ pair: string }>()

  const [swapPair, setSwapPair] = useState<Pair>({
    inputAsset: Asset.BTC(),
    outputAsset: Asset.RUNE(),
  })

  // const { addFrequent } = useAssets()

  useEffect(() => {
    const getPair = async () => {
      if (!pair) return

      const swapPairData = await getSwapPair(pair)

      if (swapPairData) {
        setSwapPair(swapPairData)
      }
    }

    getPair()
  }, [pair])

  const { inputAsset, outputAsset } = swapPair

  const { getMaxBalance } = useBalance()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const { pools: allPools, poolLoading, inboundData } = useMidgard()
  const { slippageTolerance } = useApp()

  const isInputWalletConnected = useMemo(
    () =>
      inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const isOutputWalletConnected = useMemo(
    () =>
      outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  )

  // TODO: implement approve
  // const { isApproved, assetApproveStatus } = useApprove(inputAsset, !!wallet)

  const isTradingHalted: boolean = useMemo(() => {
    const inTradeInboundData = inboundData.find(
      (data) => data.chain === inputAsset.chain,
    )
    const outTradeInboundData = inboundData.find(
      (data) => data.chain === outputAsset.chain,
    )

    const haltedStatus =
      (inTradeInboundData?.halted ?? false) ||
      (outTradeInboundData?.halted ?? false)

    return haltedStatus
  }, [inboundData, inputAsset, outputAsset])

  const { inboundFee, outboundFee, totalFeeInUSD } = useNetworkFee({
    inputAsset,
    outputAsset,
  })

  const walletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  )

  const pools = useMemo(
    () => allPools.filter((data) => data.detail.status === 'available'),
    [allPools],
  )
  const poolAssets = useMemo(() => {
    const assets = pools.map((pool) => pool.asset)
    assets.push(Asset.RUNE())

    return assets
  }, [pools])

  const synthAssets = useMemo(() => {
    return pools.map((pool) => {
      const { asset } = pool
      const synthAsset = new Asset(asset.chain, asset.symbol, true)
      synthAsset.isSynth = true

      return synthAsset
    })
  }, [pools])

  const outputAssets = useMemo(() => {
    if (IS_SYNTH_ACTIVE) {
      return [...poolAssets, ...synthAssets]
    }
    return poolAssets
  }, [poolAssets, synthAssets])

  const inputAssets = useMemo(
    () =>
      hasConnectedWallet(wallet)
        ? getInputAssets({ wallet, pools })
        : outputAssets,
    [wallet, pools, outputAssets],
  )

  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )

  const [addressDisabled, setAddressDisabled] = useState(true)
  const [recipient, setRecipient] = useState('')
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  // const [visibleApproveModal, setVisibleApproveModal] = useState(false)

  const isWalletRequired = useMemo(() => {
    if (!isInputWalletConnected) return true
    if (!isOutputWalletConnected && !recipient) return true

    return false
  }, [isInputWalletConnected, isOutputWalletConnected, recipient])

  const handleCopyAddress = useCallback(() => {
    copy(recipient)

    // TODO: add notification
    // Notification({
    //   type: 'info',
    //   message: 'Address Copied',
    //   duration: 3,
    //   placement: 'bottomRight',
    // })
  }, [recipient])

  const { isExchangeBNBAddress } = useCheckExchangeBNB(
    outputAsset.chain === Chain.Binance ? recipient : null,
  )

  const toggleAddressDisabled = useCallback(() => {
    setAddressDisabled(!addressDisabled)
  }, [addressDisabled])

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecipient(e.target.value)
    },
    [],
  )

  const isValidAddress = useMemo(() => {
    try {
      if (!recipient) return true

      if (isExchangeBNBAddress) return false

      return multichain.validateAddress({
        chain: outputAsset.L1Chain,
        address: recipient,
      })
    } catch (error) {
      return false
    }
  }, [outputAsset, recipient, isExchangeBNBAddress])

  // for GA tracking purpose
  // const isCustomRecipient = useMemo(() => {
  //   if (!wallet) return false
  //   return getWalletAddressByChain(wallet, outputAsset.L1Chain) === recipient
  // }, [wallet, outputAsset, recipient])

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) return null

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)

      const inboundFeeInInputAsset = new AssetAmount(
        inputAsset,
        Amount.fromAssetAmount(
          inboundFee.totalPriceIn(inputAsset, pools).price,
          inputAsset.decimal,
        ),
      )

      const outboundFeeInOutputAsset = outboundFee
        ? new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(
              outboundFee.totalPriceIn(outputAsset, pools).price,
              outputAsset.decimal,
            ),
          )
        : new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(0, outputAsset.decimal),
          )

      // should create a new instance to update the state
      return new Swap({
        inputAsset,
        outputAsset,
        pools,
        amount: inputAssetAmount,
        slip: slippageTolerance,
        fee: {
          inboundFee: inboundFeeInInputAsset,
          outboundFee: outboundFeeInOutputAsset,
        },
      })
    } catch (error) {
      console.log(error)
      return null
    }
  }, [
    inputAsset,
    outputAsset,
    pools,
    inputAmount,
    slippageTolerance,
    poolLoading,
    inboundFee,
    outboundFee,
  ])

  const outputAmount: Amount = useMemo(() => {
    if (swap) {
      return swap.outputAmountAfterFee.amount
    }

    return Amount.fromAssetAmount(0, 8)
  }, [swap])

  const slipPercent: Percent = useMemo(
    () => (swap ? swap.slip : new Percent(0)),
    [swap],
  )

  const minReceive: Amount = useMemo(
    () => (swap ? swap.minOutputAmount : Amount.fromAssetAmount(0, 8)),
    [swap],
  )

  const inputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: inputAsset,
        pools,
        priceAmount: inputAmount,
      }),
    [inputAsset, inputAmount, pools],
  )

  const outputAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: outputAsset,
        pools,
        priceAmount: outputAmount,
      }),
    [outputAsset, outputAmount, pools],
  )

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.L1Chain)
      setRecipient(address || '')
    }
  }, [wallet, outputAsset])

  const maxInputBalance: Amount = useMemo(
    () => getMaxBalance(inputAsset),
    [inputAsset, getMaxBalance],
  )

  const inputAssetBalance: Amount | undefined = useMemo(() => {
    if (!isInputWalletConnected) {
      return undefined
    }

    return getMaxBalance(inputAsset)
  }, [inputAsset, isInputWalletConnected, getMaxBalance])

  const handleSelectInputAsset = useCallback(
    (input: Asset) => {
      navigate(getSwapRoute(input, outputAsset))
    },
    [navigate, outputAsset],
  )

  const handleSelectOutputAsset = useCallback(
    (output: Asset) => {
      navigate(getSwapRoute(inputAsset, output))
    },
    [navigate, inputAsset],
  )

  const handleSwitchPair = useCallback(() => {
    navigate(getSwapRoute(outputAsset, inputAsset))
  }, [navigate, inputAsset, outputAsset])

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(maxInputBalance)) {
        setInputAmount(maxInputBalance)
      } else {
        setInputAmount(amount)
      }
    },
    [maxInputBalance],
  )

  const handleConfirm = useCallback(async () => {
    setVisibleConfirmModal(false)

    if (wallet && swap) {
      // TODO: add tracker
      // const trackerType = getSwapTrackerType(swap)

      // // register to tx tracker
      // const trackId = submitTransaction({
      //   type: trackerType,
      //   submitTx: {
      //     inAssets: [
      //       {
      //         asset: swap.inputAsset.toString(),
      //         amount: swap.inputAmount.toSignificant(6),
      //       },
      //     ],
      //     outAssets: [
      //       {
      //         asset: swap.outputAsset.toString(),
      //         amount: swap.outputAmountAfterFee.toSignificant(6),
      //       },
      //     ],
      //   },
      // })

      try {
        const txHash = await multichain.swap(swap, recipient)

        console.log('txHash', txHash)
        // start polling
        // pollTransaction({
        //   type: trackerType,
        //   uuid: trackId,
        //   submitTx: {
        //     inAssets: [
        //       {
        //         asset: swap.inputAsset.toString(),
        //         amount: swap.inputAmount.toSignificant(6),
        //       },
        //     ],
        //     outAssets: [
        //       {
        //         asset: swap.outputAsset.toString(),
        //         amount: swap.outputAmountAfterFee.toSignificant(6),
        //       },
        //     ],
        //     txID: txHash,
        //   },
        // })
      } catch (error: any) {
        // TODO: add tracker
        // setTxFailed(trackId)

        // TODO: add notification
        // handle better error message
        // const description = translateErrorMsg(error?.toString())
        // Notification({
        //   type: 'error',
        //   message: 'Submit Transaction Failed.',
        //   description,
        //   duration: 20,
        // })
        console.log(error)
      }
    }
  }, [
    wallet,
    swap,
    recipient,
    // isCustomRecipient,
    // inputAssetPriceInUSD,
    // submitTransaction,
    // pollTransaction,
    // setTxFailed,
  ])

  // TODO: add approve
  // const handleConfirmApprove = useCallback(async () => {
  //   // setVisibleApproveModal(false)

  //   if (wallet) {
  //     // TODO: add tx tracker
  //     // register to tx tracker
  //     // const trackId = submitTransaction({
  //     //   type: TxTrackerType.Approve,
  //     //   submitTx: {
  //     //     inAssets: [
  //     //       {
  //     //         asset: inputAsset.toString(),
  //     //         amount: '0', // not needed for approve tx
  //     //       },
  //     //     ],
  //     //   },
  //     // })

  //     try {
  //       const txHash = await multichain.approveAsset(inputAsset)
  //       console.log('approve txhash', txHash)
  //       if (txHash) {
  //         // TODO: add tx tracker
  //         // start polling
  //         // pollTransaction({
  //         //   type: TxTrackerType.Swap,
  //         //   uuid: trackId,
  //         //   submitTx: {
  //         //     inAssets: [
  //         //       {
  //         //         asset: inputAsset.toString(),
  //         //         amount: '0', // not needed for approve tx
  //         //       },
  //         //     ],
  //         //     txID: txHash,
  //         //   },
  //         // })
  //       }
  //     } catch (error) {
  //       // TODO: add tx tracker
  //       // setTxFailed(trackId)
  //       // Notification({
  //       //   type: 'open',
  //       //   message: 'Approve Failed.',
  //       //   duration: 20,
  //       // })
  //       console.log(error)
  //     }
  //   }
  // }, [inputAsset, wallet])

  const handleSwap = useCallback(() => {
    if (walletConnected && swap) {
      if (
        swap.outputAsset.chain === 'ETH' &&
        outputAssetPriceInUSD.raw().lt(50)
      ) {
        // TODO: add notify
        // Notification({
        //   type: 'info',
        //   message: 'Swap Output Amount is too small',
        //   description:
        //     'Swap output amount is small and can be slashed out by ethereum gas fee',
        // })
        return
      }

      if (swap.hasInSufficientFee) {
        // TODO: add notify
        // Notification({
        //   type: 'info',
        //   message: 'Swap Insufficient Fee',
        //   description: 'Input amount is not enough to cover the fee',
        // })
        return
      }

      if (isExchangeBNBAddress) {
        // TODO: add notify
        // Notification({
        //   type: 'error',
        //   message: 'Exchange BNB Address',
        //   description: 'Cannot swap into an Exchange address.',
        // })
        return
      }

      if (!isValidAddress) {
        // TODO: add notify
        // Notification({
        //   type: 'error',
        //   message: 'Invalid Recipient Address',
        //   description: 'Recipient address should be a valid address.',
        // })
        return
      }

      setVisibleConfirmModal(true)
    } else {
      // TODO: add notify
      // Notification({
      //   type: 'info',
      //   message: 'Wallet Not Found',
      //   description: 'Please connect wallet',
      // })
    }
  }, [
    isValidAddress,
    isExchangeBNBAddress,
    walletConnected,
    swap,
    outputAssetPriceInUSD,
  ])

  // TODO: add approve
  // const handleApprove = useCallback(() => {
  //   if (walletConnected && swap) {
  //     setVisibleApproveModal(true)
  //   } else {
  //     Notification({
  //       type: 'info',
  //       message: 'Wallet Not Found',
  //       description: 'Please connect wallet',
  //     })
  //   }
  // }, [walletConnected, swap])

  const isValidSwap = useMemo(() => {
    if (isTradingHalted) {
      return {
        valid: false,
        msg: 'Swap not available',
      }
    }

    return swap?.isValid() ?? { valid: false }
  }, [swap, isTradingHalted])

  const isValidSlip = useMemo(() => swap?.isSlipValid() ?? true, [swap])

  const btnLabel = useMemo(() => {
    if (isValidSwap.valid || inputAmount.eq(0)) {
      if (inputAsset.isSynth && outputAsset.isSynth) {
        return 'Swap'
      }
      if (inputAsset.isSynth) {
        return 'Redeem'
      }
      if (outputAsset.isSynth) {
        return 'Mint'
      }
      return 'Swap'
    }

    return isValidSwap?.msg ?? 'Swap'
  }, [isValidSwap, inputAmount, inputAsset, outputAsset])

  const estimatedTime = useMemo(
    () =>
      getEstimatedTxTime({
        chain: inputAsset.L1Chain as SupportedChain,
        amount: inputAmount,
      }),
    [inputAsset, inputAmount],
  )

  const title = useMemo(
    () => `Swap ${inputAsset.name} >> ${outputAsset.name}`,
    [inputAsset, outputAsset],
  )

  // const poolAsset = useMemo(
  //   () => (inputAsset.isRUNE() ? outputAsset : inputAsset),
  //   [inputAsset, outputAsset],
  // )

  const inputAssetProps = useMemo(
    () => ({
      asset: inputAsset,
      value: inputAmount,
      balance: inputAssetBalance,
      usdPrice: inputAssetPriceInUSD,
    }),
    [inputAsset, inputAmount, inputAssetBalance, inputAssetPriceInUSD],
  )

  const outputAssetProps = useMemo(
    () => ({
      asset: outputAsset,
      value: outputAmount,
      usdPrice: outputAssetPriceInUSD,
    }),
    [outputAsset, outputAmount, outputAssetPriceInUSD],
  )

  const inputAssetList = useMemo(
    () =>
      inputAssets.map((asset: Asset) => ({
        asset,
        balance: inputAssetBalance,
      })),
    [inputAssets, inputAssetBalance],
  )

  const outputAssetList = useMemo(
    () =>
      outputAssets.map((asset: Asset) => ({
        asset,
        balance: getMaxBalance(asset),
      })),
    [outputAssets, getMaxBalance],
  )

  const swapConfirmInfo = useConfirmInfoItems({
    inputAsset: inputAssetProps,
    outputAsset: outputAssetProps,
    recipient,
    estimatedTime,
    slippage: slipPercent.toFixed(3),
    isValidSlip,
    minReceive: `${minReceive.toSignificant(
      6,
    )} ${outputAsset.name.toUpperCase()}`,
    totalFee: totalFeeInUSD.toCurrencyFormat(2),
  })

  const renderConfirmModalContent = useMemo(
    () => <InfoTable items={swapConfirmInfo} />,
    [swapConfirmInfo],
  )

  const navigateToPoolInfo = useCallback(() => {
    const asset = inputAsset.isRUNE() ? outputAsset : inputAsset

    navigateToExternalLink(getPoolDetailRouteFromAsset(asset))
  }, [inputAsset, outputAsset])

  return (
    <PanelView
      title={title}
      header={
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box center row className="space-x-2">
              <Button
                onClick={navigateToPoolInfo}
                className="px-1.5 group"
                type="borderless"
                variant="tint"
                startIcon={
                  <Icon
                    className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                    color="secondary"
                    name="chart"
                  />
                }
              />
              <SwapSettingsPopover />
            </Box>
          }
        />
      }
    >
      <AssetInputs
        inputAsset={inputAssetProps}
        outputAsset={outputAssetProps}
        inputAssetList={inputAssetList}
        outputAssetList={outputAssetList}
        onInputAssetChange={handleSelectInputAsset}
        onOutputAssetChange={handleSelectOutputAsset}
        onInputAmountChange={handleChangeInputAmount}
        onSwitchPair={handleSwitchPair}
      />

      {recipient && (
        <PanelInput
          placeholder={`${t('common.recipientAddress')} ${t('common.here')}`}
          stretch
          disabled={addressDisabled}
          onChange={handleChangeRecipient}
          value={recipient}
          titleComponent={
            <Box flex={1} alignCenter justify="between">
              <PanelInputTitle> {t('common.recipientAddress')}</PanelInputTitle>

              <Box row>
                <Box className={baseHoverClass}>
                  <Icon
                    color="secondary"
                    name={addressDisabled ? 'lock' : 'edit'}
                    size={16}
                    onClick={toggleAddressDisabled}
                  />
                </Box>
                <Box className={baseHoverClass}>
                  <Icon
                    color="secondary"
                    name="copy"
                    size={16}
                    onClick={handleCopyAddress}
                  />
                </Box>
                <Box className={baseHoverClass}>
                  <Icon
                    color="secondary"
                    name="share"
                    size={16}
                    onClick={() => {}}
                  />
                </Box>
              </Box>
            </Box>
          }
        />
      )}

      {swap && (
        <SwapInfo
          price={swap.price}
          inputAsset={inputAssetProps}
          outputAsset={outputAssetProps}
          isValidSlip={isValidSlip}
          slippage={slipPercent.toFixed(3)}
          minReceive={`${minReceive.toSignificant(
            6,
          )} ${outputAsset.name.toUpperCase()}`}
          networkFee={totalFeeInUSD.toCurrencyFormat(2)}
        />
      )}

      {/* <AutoRouterInfo
          firstAsset={firstAsset.asset}
          secondAsset={secondAsset.asset}
        /> */}

      <Box className="w-full pt-5">
        {isWalletRequired && (
          <Button stretch size="lg" onClick={() => setIsConnectModalOpen(true)}>
            {t('common.connectWallet')}
          </Button>
        )}
        {!isWalletRequired && (
          <Button
            isFancy
            error={!isValidSwap.valid}
            stretch
            size="lg"
            onClick={handleSwap}
          >
            {btnLabel}
          </Button>
        )}

        <ConfirmModal
          inputAssets={[inputAsset]}
          isOpened={visibleConfirmModal}
          onClose={() => setVisibleConfirmModal(false)}
          onConfirm={handleConfirm}
        >
          {renderConfirmModalContent}
        </ConfirmModal>
      </Box>
    </PanelView>
  )
}

export default SwapView
