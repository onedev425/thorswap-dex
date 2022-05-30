import { useCallback } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'

import { StakeActions, vThorAssets } from 'views/StakeVThor/types'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Typography } from 'components/Atomic'
import { ChainBadge } from 'components/ChainBadge'
import { ConfirmModal } from 'components/Modals/ConfirmModal'

import { toOptionalFixed } from 'helpers/number'

type Props = {
  action: StakeActions
  isOpened: boolean
  closeModal: () => void
  handleAction: () => void
  inputAmount: Amount
  outputAmount: number
}

export const ConfirmVThorModal = ({
  inputAmount,
  outputAmount,
  action,
  handleAction,
  closeModal,
  isOpened,
}: Props) => {
  const asset =
    action === StakeActions.Deposit ? vThorAssets.unstake : vThorAssets.deposit

  const handleConfirm = useCallback(() => {
    closeModal()
    handleAction()
  }, [closeModal, handleAction])

  return (
    <ConfirmModal
      inputAssets={[vThorAssets[action]]}
      isOpened={isOpened}
      onConfirm={handleConfirm}
      onClose={closeModal}
    >
      <Box className="w-full">
        <Box className="w-full" row alignCenter justify="between">
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={vThorAssets[action]} />
            <Box className="pt-2" center>
              <ChainBadge asset={vThorAssets[action]} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {toOptionalFixed(inputAmount.assetAmount.toNumber())}{' '}
                {vThorAssets[action].ticker}
              </Typography>
            </Box>
          </Box>
          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box className="flex-1 p-4 rounded-2xl" center col>
            <AssetIcon asset={asset} />
            <Box className="pt-2" center>
              <ChainBadge asset={asset} />
            </Box>
            <Box className="w-full" center>
              <Typography variant="caption" fontWeight="medium">
                {toOptionalFixed(outputAmount)} {asset.ticker}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ConfirmModal>
  )
}
