import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box } from 'components/Atomic'
import {
  useHandleWalletTypeSelect,
  useWalletOptions,
} from 'components/Modals/WalletModal/hooks'
import { Scrollbar } from 'components/Scrollbar'

import useWindowSize from 'hooks/useWindowSize'

import { WalletType, WalletStage } from './types'
import { WalletOption } from './WalletOption'

type Props = {
  clearStatus: () => void
  setWalletType: (walletType: WalletType) => void
  setWalletStage: (walletStage: WalletStage) => void
  setPendingChains: (pendingChains: SupportedChain[]) => void
}

export const WalletTypes = ({
  clearStatus,
  setWalletType,
  setWalletStage,
  setPendingChains,
}: Props) => {
  const { isMdActive } = useWindowSize()

  const handleWalletTypeSelect = useHandleWalletTypeSelect({
    setWalletType,
    setWalletStage,
    setPendingChains,
    clearStatus,
  })

  const walletOptions = useWalletOptions({ isMdActive })

  return (
    <Scrollbar maxHeight="60vh">
      <Box className="px-4 gap-4 flex-wrap justify-center">
        {walletOptions.map(
          ({ type, label, icon, visible = true }) =>
            visible && (
              <WalletOption
                key={label}
                label={label}
                icon={icon}
                type={type}
                handleTypeSelect={handleWalletTypeSelect}
              />
            ),
        )}
      </Box>
    </Scrollbar>
  )
}
