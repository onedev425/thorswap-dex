import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Amount, Asset, Price } from '@thorswap-lib/multichain-sdk'

import { useMultissigAssets } from 'views/Multisig/hooks'

import { useMidgard } from 'store/midgard/hooks'
import { useMultisig } from 'store/multisig/hooks'

import { getMultisigTxCreateRoute, ROUTES } from 'settings/constants'

export const useTxSend = () => {
  const { assetsWithBalance: assetInputList, getMaxBalance } =
    useMultissigAssets()
  const { assetParam } = useParams<{ assetParam: string }>()
  const navigate = useNavigate()

  const [sendAsset, setSendAsset] = useState<Asset>(Asset.RUNE())

  const [sendAmount, setSendAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  )

  const [memo, setMemo] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)

  const { pools } = useMidgard()

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: sendAsset,
        pools,
        priceAmount: sendAmount,
      }),
    [sendAsset, sendAmount, pools],
  )

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  )

  const assetInput = useMemo(
    () => ({
      asset: sendAsset,
      value: sendAmount,
      balance: maxSpendableBalance,
      usdPrice: assetPriceInUSD,
    }),
    [sendAsset, sendAmount, maxSpendableBalance, assetPriceInUSD],
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

  const handleSelectAsset = useCallback(
    (selected: Asset) => {
      setRecipientAddress('')
      navigate(getMultisigTxCreateRoute(selected))
    },
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

  const handleSubmit = useCallback(() => {
    setIsOpenConfirmModal(true)
  }, [])

  const handleCancelConfirm = useCallback(() => {
    setIsOpenConfirmModal(false)
  }, [])

  const { createTransferTx } = useMultisig()

  const handleCreateTx = async () => {
    const tx = await createTransferTx({
      recipient: recipientAddress,
      memo,
      asset: sendAsset,
      amount: sendAmount,
    })

    if (tx) {
      navigate(ROUTES.TxMultisig, {
        state: { tx },
      })
    }
  }

  return {
    isOpenConfirmModal,
    assetInputList,
    assetPriceInUSD,
    memo,
    recipientAddress,
    assetInput,
    sendAmount,
    handleSelectAsset,
    handleChangeSendAmount,
    handleChangeRecipient,
    handleChangeMemo,
    handleSubmit,
    handleCancelConfirm,
    sendAsset,
    handleCreateTx,
  }
}
