import { AddDeposit } from 'views/PendingLiquidity/AddDeposit'
import { PendingDeposit } from 'views/PendingLiquidity/PendingDeposit'
import { PendingTile } from 'views/PendingLiquidity/PendingTile'

import { Box, Button, Card, Icon } from 'components/Atomic'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

export const PendingLiquidity = () => {
  return (
    <Box className="self-center w-full max-w-[600px]" col>
      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('views.pendingLiquidity.pendingLiquidity')}
          actionsComponent={
            <Box className="gap-8" row>
              <Icon color="secondary" name="chart" className="ml-auto" />
              <Icon name="cog" color="secondary" />
            </Box>
          }
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
      >
        <PendingDeposit />
        <AddDeposit />
        <PendingTile />

        <Box className="py-5 md:pt-10">
          <Button stretch size="lg">
            {t('views.pendingLiquidity.insufficientAmount')}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
