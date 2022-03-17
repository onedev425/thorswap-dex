import { AddDeposit } from 'views/PendingLiquidity/AddDeposit'
import { PendingDeposit } from 'views/PendingLiquidity/PendingDeposit'
import { PendingTile } from 'views/PendingLiquidity/PendingTile'

import { Box, Button, Icon } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

export const PendingLiquidity = () => {
  return (
    <PanelView
      title="Pending Liquidity"
      header={
        <ViewHeader
          title={t('views.pendingLiquidity.pendingLiquidity')}
          actionsComponent={
            <Box className="gap-8" row>
              <Icon color="secondary" name="chart" className="ml-auto" />
              <Icon name="cog" color="secondary" />
            </Box>
          }
        />
      }
    >
      <PendingDeposit />
      <AddDeposit />
      <PendingTile />

      <Box className="w-full pt-5">
        <Button stretch size="lg">
          {t('views.pendingLiquidity.insufficientAmount')}
        </Button>
      </Box>
    </PanelView>
  )
}
