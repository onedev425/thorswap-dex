import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import {
  getWalletAssets,
  Amount,
  Asset,
  Price,
  hasWalletConnected,
} from '@thorswap-lib/multichain-sdk'

import { useConfirmSend } from 'views/Send/useConfirmSend'

import { AssetInput } from 'components/AssetInput'
import { Button, Box, Tooltip, Icon, Typography } from 'components/Atomic'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { InfoTable } from 'components/InfoTable'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelInput } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { showToast, ToastType } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useBalance } from 'hooks/useBalance'
import { useNetworkFee } from 'hooks/useNetworkFee'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { commonAssets } from 'helpers/assetsFixture'

import { getSendRoute } from 'settings/constants'

// TODO: refactor useReducer
const Send = () => {
  const navigate = useNavigate()
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

  const handleConfirmSend = useConfirmSend({
    setIsOpenConfirmModal,
    sendAmount,
    sendAsset,
    recipientAddress,
    memo,
  })

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  )

  useEffect(() => {
    const getSendAsset = async () => {
      if (!assetParam) {
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
    (selected: Asset) => navigate(getSendRoute(selected)),
    [navigate],
  )

  const handleChangeSendAmount = useCallback(
    (amount: Amount) =>
      setSendAmount(
        amount.gt(maxSpendableBalance) ? maxSpendableBalance : amount,
      ),
    [maxSpendableBalance],
  )

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setRecipientAddress(value)
    },
    [],
  )

  const handleChangeMemo = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setMemo(value)
    },
    [],
  )

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
      showToast(
        {
          message: t('notification.invalidL1ChainAddy', {
            chain: sendAsset.L1Chain,
          }),
        },
        ToastType.Error,
        { duration: 20 * 1000 },
      )
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

  return (
    <PanelView
      title={t('common.send')}
      header={
        <ViewHeader
          title={t('common.send')}
          actionsComponent={<GlobalSettingsPopover />}
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
        placeholder={`${assetInput.asset.network} ${t('common.address')}`}
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
          <InfoTable items={confirmModalInfo} />
        </ConfirmModal>
      )}
    </PanelView>
  )
}

export default Send
