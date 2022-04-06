import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import {
  getWalletAssets,
  Amount,
  Asset,
  Price,
  AssetAmount,
  hasWalletConnected,
} from '@thorswap-lib/multichain-sdk'
import { commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { Button, Box, Tooltip, Icon, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelInput } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'redux/midgard/hooks'
import { TxTrackerType } from 'redux/midgard/types'
import { useWallet } from 'redux/wallet/hooks'

import { useBalance } from 'hooks/useBalance'
import { useNetworkFee } from 'hooks/useNetworkFee'
import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { getSendRoute } from 'settings/constants'

// TODO: refactor useReducer
const Send = () => {
  const navigate = useNavigate()
  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker()

  const { assetParam } = useParams<{ assetParam: string }>()

  const [sendAsset, setSendAsset] = useState<Asset>(Asset.RUNE())

  const [sendAmount, setSendAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )

  const [memo, setMemo] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)

  const { wallet, setIsConnectModalOpen } = useWallet()
  const { pools } = useMidgard()
  const { getMaxBalance } = useBalance()
  const { inboundFee, totalFeeInUSD } = useNetworkFee({ inputAsset: sendAsset })

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  )

  useEffect(() => {
    const getSendAsset = async () => {
      if (!assetParam) {
        // set RUNE as a default asset
        setSendAsset(Asset.RUNE())
      } else {
        const assetObj = Asset.decodeFromURL(assetParam)

        if (assetObj) {
          await assetObj.setDecimal()
          setSendAsset(assetObj)
        } else {
          setSendAsset(Asset.RUNE())
        }
      }
    }

    getSendAsset()
  }, [assetParam])

  const isWalletConnected = useMemo(
    () => sendAsset && hasWalletConnected({ wallet, inputAssets: [sendAsset] }),
    [wallet, sendAsset],
  )

  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet])

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: sendAsset,
        pools,
        priceAmount: sendAmount,
      }),
    [sendAsset, sendAmount, pools],
  )

  const handleSelectAsset = useCallback(
    (selected: Asset) => {
      navigate(getSendRoute(selected))
    },
    [navigate],
  )

  const handleChangeSendAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(maxSpendableBalance)) {
        setSendAmount(maxSpendableBalance)
      } else {
        setSendAmount(amount)
      }
    },
    [maxSpendableBalance],
  )

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value
      setRecipientAddress(addr)
    },
    [],
  )

  const handleChangeMemo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMemo(e.target.value)
    },
    [],
  )

  const handleConfirmSend = useCallback(async () => {
    setIsOpenConfirmModal(false)

    if (sendAsset) {
      const assetAmount = new AssetAmount(sendAsset, sendAmount)

      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Send,
        submitTx: {
          inAssets: [
            {
              asset: sendAsset.toString(),
              amount: sendAmount.toSignificant(6),
            },
          ],
        },
      })

      try {
        const txHash = await multichain.send({
          assetAmount,
          recipient: recipientAddress,
          memo,
        })

        console.log('txHash', txHash)

        const txURL = multichain.getExplorerTxUrl(sendAsset.L1Chain, txHash)

        console.log('txURL', txURL)
        if (txHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Send,
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: sendAsset.toString(),
                  amount: sendAmount.toSignificant(6),
                },
              ],
              txID: txHash,
            },
          })
        }
      } catch (error) {
        console.log('error', error)
        setTxFailed(trackId)

        // TODO: notification
        // Notification({
        //   type: 'error',
        //   message: 'Send Transaction Failed.',
        //   description: error?.toString(),
        //   duration: 20,
        // })
      }
    }
  }, [
    sendAsset,
    sendAmount,
    recipientAddress,
    memo,
    pollTransaction,
    setTxFailed,
    submitTransaction,
  ])

  const handleCancelSend = useCallback(() => {
    setIsOpenConfirmModal(false)
  }, [])

  const handleSend = useCallback(() => {
    if (
      !multichain.validateAddress({
        chain: sendAsset.L1Chain,
        address: recipientAddress,
      })
    ) {
      // TODO: notification
      // Notification({
      //   type: 'warning',
      //   message: `Recipient Address is not valid ${sendAsset.L1Chain} Address, please check your address again.`,
      //   duration: 20,
      // })
    } else {
      setIsOpenConfirmModal(true)
    }
  }, [sendAsset, recipientAddress])

  const assetInput = useMemo(
    () => ({
      asset: sendAsset,
      value: sendAmount,
      balance: isWalletConnected ? maxSpendableBalance : undefined,
      usdPrice: assetPriceInUSD,
    }),
    [
      sendAsset,
      sendAmount,
      maxSpendableBalance,
      assetPriceInUSD,
      isWalletConnected,
    ],
  )

  const assetInputList = useMemo(
    () =>
      walletAssets.map((asset: Asset) => ({
        asset,
        balance: getMaxBalance(asset),
      })),
    [walletAssets, getMaxBalance],
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

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${sendAmount?.toSignificant(6)} ${sendAsset.name}`,
      },
      { label: t('common.recipient'), value: recipientAddress },
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
    [recipientAddress, sendAsset, sendAmount, inboundFee, totalFeeInUSD],
  )

  const renderConfirmModalContent = useMemo(
    () => <InfoTable items={confirmModalInfo} />,
    [confirmModalInfo],
  )

  return (
    <PanelView
      title={t('common.send')}
      header={
        <ViewHeader
          title={t('common.send')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
    >
      <AssetInput
        selectedAsset={assetInput}
        assets={assetInputList}
        commonAssets={commonAssets}
        onAssetChange={handleSelectAsset}
        onValueChange={handleChangeSendAmount}
      />

      <PanelInput
        title={t('common.recipientAddress')}
        placeholder=""
        onChange={handleChangeRecipient}
        value={recipientAddress}
      />

      <PanelInput
        collapsible
        title={t('common.memo')}
        onChange={handleChangeMemo}
        value={memo}
      />

      <InfoTable horizontalInset items={summary} />

      <Box center className="w-full pt-5">
        {isWalletConnected && (
          <Button isFancy stretch size="lg" onClick={handleSend}>
            {t('common.send')}
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
      </Box>

      {isOpenConfirmModal && (
        <ConfirmModal
          inputAssets={[sendAsset]}
          isOpened={isOpenConfirmModal}
          onConfirm={handleConfirmSend}
          onClose={handleCancelSend}
        >
          {renderConfirmModalContent}
        </ConfirmModal>
      )}
    </PanelView>
  )
}
export default Send
