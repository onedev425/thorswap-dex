import { Button } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

import { LiquidityPositions } from './LiquidityPositions'

const ManageLiquidity = () => {
  const { wallet } = useWallet()

  return (
    <PanelView
      title="Liquidity"
      header={
        <ViewHeader
          title={t('common.liquidityPosition')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
    >
      {wallet ? (
        <LiquidityPositions />
      ) : (
        <Button>{t('common.connectWallet')}</Button>
      )}
    </PanelView>
  )
}

export default ManageLiquidity
