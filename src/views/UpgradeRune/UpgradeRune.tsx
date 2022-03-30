import { useState, useMemo, useCallback } from 'react'

import {
  Asset,
  Amount,
  hasWalletConnected,
  getAssetBalance,
  Price,
  AssetAmount,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { AssetInput } from 'components/AssetInput'
import {
  Button,
  Modal,
  Card,
  Icon,
  Box,
  Typography,
  Tooltip,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { InfoRow } from 'components/InfoRow'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { useBalance } from 'hooks/useBalance'
import { useMimir } from 'hooks/useMimir'
import { useNetworkFee } from 'hooks/useNetworkFee'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

const oldRunes = [Asset.BNB_RUNE(), Asset.ETH_RUNE()]

const UpgradeRune = () => {
  const [isOpened, setIsOpened] = useState(false)

  const thorchainAddr =
    multichain.getWalletAddressByChain(Chain.THORChain) || ''
  const [recipientAddress, setRecipientAddress] = useState(thorchainAddr)

  const { wallet } = useWallet()
  const { getMaxBalance } = useBalance()
  const { pools } = useMidgard()

  const [selectedAsset, setSelectedAsset] = useState<Asset>(oldRunes[0])
  const [upgradeAmount, setUpgradeAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, selectedAsset.decimal),
  )

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(selectedAsset),
    [selectedAsset, getMaxBalance],
  )

  const { inboundFee, totalFeeInUSD } = useNetworkFee({
    inputAsset: selectedAsset,
  })

  const isWalletConnected = useMemo(
    () =>
      selectedAsset &&
      hasWalletConnected({ wallet, inputAssets: [selectedAsset] }),
    [wallet, selectedAsset],
  )

  const { isChainTradingHalted } = useMimir()

  const isTradingHalted: boolean = useMemo(() => {
    return isChainTradingHalted?.[selectedAsset.chain] ?? false
  }, [isChainTradingHalted, selectedAsset])

  const assetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(selectedAsset, wallet).amount
    }
    return Amount.fromAssetAmount(0, 8)
  }, [selectedAsset, wallet])

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: assetBalance,
      }),
    [assetBalance, pools],
  )

  const handleChangeUpgradeAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(maxSpendableBalance)) {
        setUpgradeAmount(maxSpendableBalance)
      } else {
        setUpgradeAmount(amount)
      }
    },
    [maxSpendableBalance],
  )

  const handleConfirmUpgrade = useCallback(async () => {
    setIsOpened(false)

    if (selectedAsset && recipientAddress) {
      const runeAmount = new AssetAmount(selectedAsset, upgradeAmount)

      // TODO: tx tracker
      // register to tx tracker
      // const trackId = submitTransaction({
      //   type: TxTrackerType.Switch,
      //   submitTx: {
      //     inAssets: [
      //       {
      //         asset: selectedAsset.toString(),
      //         amount: upgradeAmount.toSignificant(6),
      //       },
      //     ],
      //     outAssets: [
      //       {
      //         asset: Asset.RUNE().toString(),
      //         amount: upgradeAmount.toSignificant(6),
      //       },
      //     ],
      //     recipient: recipientAddress,
      //   },
      // })

      try {
        const txHash = await multichain.upgrade({
          runeAmount,
          recipient: recipientAddress,
        })
        console.log('txHash', txHash)

        // TODO: tx tracker
        // start polling
        // pollTransaction({
        //   type: TxTrackerType.Switch,
        //   uuid: trackId,
        //   submitTx: {
        //     inAssets: [
        //       {
        //         asset: selectedAsset.toString(),
        //         amount: upgradeAmount.toSignificant(6),
        //       },
        //     ],
        //     outAssets: [
        //       {
        //         asset: Asset.RUNE().toString(),
        //         amount: upgradeAmount.toSignificant(6),
        //       },
        //     ],
        //     txID: txHash,
        //     submitDate: new Date(),
        //     recipient: recipientAddress,
        //   },
        // })
      } catch (error) {
        // TODO: tx tracker
        // setTxFailed(trackId)

        // TODO: notification
        // Notification({
        //   type: 'error',
        //   message: 'Submit Transaction Failed.',
        //   duration: 20,
        // })
        console.log(error)
      }
    }
  }, [
    selectedAsset,
    upgradeAmount,
    // submitTransaction,
    // pollTransaction,
    recipientAddress,
    // setTxFailed,
  ])

  const handleUpgrade = useCallback(() => {
    // TODO: notifications
    if (isTradingHalted) {
      // Notification({
      //   type: 'info',
      //   message:
      //     'Upgrade not available due to trading is temporarily halted, please try again later.',
      // })
      return
    }
    if (!recipientAddress) {
      // Notification({
      //   type: 'info',
      //   message: 'You have to connect wallet for Thorchain.',
      // })
      return
    }
    if (
      !multichain.validateAddress({
        chain: Chain.THORChain,
        address: recipientAddress,
      })
    ) {
      // Notification({
      //   type: 'error',
      //   message: 'Invalid Recipient Address',
      //   description: 'Recipient address should be a valid address.',
      // })
      return
    }

    setIsOpened(true)
  }, [recipientAddress, isTradingHalted])

  const assetInput = useMemo(
    () => ({
      asset: selectedAsset,
      value: upgradeAmount,
      balance: maxSpendableBalance,
      usdPrice: assetPriceInUSD,
    }),
    [selectedAsset, upgradeAmount, maxSpendableBalance, assetPriceInUSD],
  )

  const assetInputList = useMemo(
    () =>
      oldRunes.map((asset: Asset) => ({
        asset,
        balance: getMaxBalance(asset),
      })),
    [getMaxBalance],
  )

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: (
          <Box className="gap-2" center>
            <Typography variant="caption">{`${inboundFee.toCurrencyFormat()} (${totalFeeInUSD.toCurrencyFormat()})`}</Typography>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon size={20} color="secondary" name="infoCircle" />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [inboundFee, totalFeeInUSD],
  )

  // TODO: add more validations

  return (
    <Box className="self-center w-full max-w-[480px]" col>
      <Helmet title="Upgrade Rune" content="Upgrade BNB Rune" />

      <Box className="w-full mx-2" col>
        <ViewHeader
          title="Upgrade BNB Rune"
          actionsComponent={
            <Box row className="space-x-4">
              <Icon color="secondary" name="chart" className="ml-auto" />
            </Box>
          }
        />
      </Box>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
        stretch
      >
        <Box col className="gap-y-4" flex={1}>
          <AssetInput
            selectedAsset={assetInput}
            onAssetChange={setSelectedAsset}
            onValueChange={handleChangeUpgradeAmount}
            assets={assetInputList}
            commonAssets={assetInputList}
            className="!mb-1"
          />

          <InfoRow label={t('common.transactionFee')} value="0.00075 BNB" />

          <Box col>
            <Input
              border="bottom"
              className="text-lg"
              value={recipientAddress}
              stretch
              placeholder={t('common.recipientAddress')}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </Box>
        </Box>

        <InfoTable horizontalInset items={summary} />

        <Box className="w-full pt-5">
          {isWalletConnected && (
            <Button stretch size="lg" onClick={handleUpgrade}>
              {t('common.upgrade')}
            </Button>
          )}
          {!isWalletConnected && (
            <Button stretch size="lg" onClick={() => setIsOpened(true)}>
              Connect Wallet
            </Button>
          )}

          {isOpened && (
            <Modal
              title={`Upgrade ${selectedAsset.network} RUNE`}
              isOpened={isOpened}
              onClose={handleConfirmUpgrade} // TODO: fix
            >
              {/*  */}
            </Modal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default UpgradeRune
