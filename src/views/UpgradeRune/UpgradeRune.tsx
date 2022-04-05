import { useState, useMemo, useCallback } from 'react'

import {
  Asset,
  Amount,
  hasWalletConnected,
  Price,
  AssetAmount,
  getRuneToUpgrade,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { AssetInput } from 'components/AssetInput'
import { Button, Card, Icon, Box, Typography, Tooltip } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
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

  const { wallet, setIsConnectModalOpen } = useWallet()
  const { getMaxBalance, isWalletAssetConnected } = useBalance()
  const { pools } = useMidgard()

  const [selectedAsset, setSelectedAsset] = useState<Asset>(oldRunes[0])
  const [upgradeAmount, setUpgradeAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, selectedAsset.decimal),
  )
  const runeToUpgrade = useMemo(() => {
    const runes = getRuneToUpgrade(wallet)

    if (runes && runes.length > 0) return runes
    return oldRunes
  }, [wallet])

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

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: upgradeAmount,
      }),
    [upgradeAmount, pools],
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
      balance: isWalletAssetConnected(selectedAsset)
        ? maxSpendableBalance
        : undefined,
      usdPrice: assetPriceInUSD,
    }),
    [
      selectedAsset,
      upgradeAmount,
      maxSpendableBalance,
      assetPriceInUSD,
      isWalletAssetConnected,
    ],
  )

  const assetInputList = useMemo(
    () =>
      runeToUpgrade.map((asset: Asset) => ({
        asset,
        balance: isWalletAssetConnected(asset)
          ? getMaxBalance(asset)
          : undefined,
      })),
    [runeToUpgrade, getMaxBalance, isWalletAssetConnected],
  )

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: (
          <Box className="gap-2" center>
            <Typography variant="caption">{`${inboundFee.toCurrencyFormat()} (${totalFeeInUSD.toCurrencyFormat(
              2,
            )})`}</Typography>
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

  console.log('wallet', wallet?.BNB?.balance)
  console.log('asset', Asset.BNB_RUNE())

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
            <Button
              isFancy
              stretch
              size="lg"
              onClick={() => setIsConnectModalOpen(true)}
            >
              {t('common.connectWallet')}
            </Button>
          )}

          {isOpened && (
            <ConfirmModal
              inputAssets={[selectedAsset]}
              isOpened={isOpened}
              onConfirm={handleConfirmUpgrade}
              onClose={() => setIsOpened(false)}
            >
              {/** TODO: UI */}
            </ConfirmModal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default UpgradeRune
