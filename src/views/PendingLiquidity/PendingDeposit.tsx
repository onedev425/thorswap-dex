import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

export const PendingDeposit = memo(() => {
  return (
    <Card className="self-stretch px-4 md:mx-4 md:mt-4 bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col">
      <Box className="cursor-pointer" alignCenter justify="between">
        <Box alignCenter>
          <AssetIcon className="mr-4" asset={Asset.RUNE()} size={32} />

          <Box col>
            <Typography variant="subtitle1">
              {Asset.RUNE().toString()}
            </Typography>
            <Typography
              variant="caption-xs"
              className="!text-transparent bg-clip-text bg-gradient-to-br from-blue to-cyan"
            >
              {Asset.RUNE().chain.toString()}
            </Typography>
          </Box>
        </Box>

        <Box alignCenter>
          <Typography
            className="hidden sm:flex"
            variant="subtitle1"
            fontWeight="medium"
          >
            {t('views.pendingLiquidity.pending')} {'22,212.2 '}
            {t('views.pendingLiquidity.assetTicker')}
          </Typography>
          <Icon className="px-2" color="secondary" name="share" size={20} />
        </Box>
      </Box>

      <Box className="gap-6 !mt-6" justifyCenter>
        <Button size="sm">
          <Typography variant="subtitle2">
            {t('views.pendingLiquidity.complete')}
          </Typography>
        </Button>

        <Button size="sm">
          <Typography variant="subtitle2">
            {t('views.pendingLiquidity.withdraw')}
          </Typography>
        </Button>
      </Box>
    </Card>
  )
})
