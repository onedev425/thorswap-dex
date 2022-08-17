import { memo, useCallback, useMemo } from 'react'

import { Amount, getEstimatedTxTime } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { AssetInputType } from 'components/AssetInput/types'
import { ConfirmModal } from 'components/Modals/ConfirmModal'

import { ConfirmContent } from './ConfirmContent'

type Props = {
  affiliateFee: string
  feeAssets: string
  inputAmount: Amount
  inputAssetProps: AssetInputType
  minReceive: string
  outputAssetProps: AssetInputType
  recipient: string
  setVisible: (visible: boolean) => void
  slippageInfo: string
  handleSwap: () => Promise<void>
  totalFee: string
  visible: boolean
}

export const ConfirmSwapModal = memo(
  ({
    affiliateFee,
    feeAssets,
    handleSwap,
    inputAmount,
    inputAssetProps,
    minReceive,
    outputAssetProps,
    recipient,
    setVisible,
    slippageInfo,
    totalFee,
    visible,
  }: Props) => {
    const { asset: inputAsset } = inputAssetProps

    const handleConfirm = useCallback(async () => {
      setVisible(false)
      handleSwap()
    }, [setVisible, handleSwap])

    const estimatedTime = useMemo(
      () =>
        getEstimatedTxTime({
          chain: inputAsset.L1Chain as SupportedChain,
          amount: inputAmount,
        }),
      [inputAsset, inputAmount],
    )

    return (
      <ConfirmModal
        inputAssets={[inputAsset]}
        isOpened={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      >
        <ConfirmContent
          affiliateFee={affiliateFee}
          estimatedTime={estimatedTime}
          feeAssets={feeAssets}
          inputAsset={inputAssetProps}
          minReceive={minReceive}
          outputAsset={outputAssetProps}
          recipient={recipient}
          slippageInfo={slippageInfo}
          totalFee={totalFee}
        />
      </ConfirmModal>
    )
  },
)
