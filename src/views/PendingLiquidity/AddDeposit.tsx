import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Card, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

export const AddDeposit = memo(() => {
  return (
    <Card className="self-stretch md:mx-4 bg-light-gray-light dark:!bg-dark-gray-light  !rounded-2xl flex-col">
      <Box alignCenter>
        <Box flex={1} col>
          <Typography
            fontWeight="semibold"
            transform="capitalize"
            variant="subtitle1"
          >
            {t('views.pendingLiquidity.addToComplete')} {'($0.00)'}
          </Typography>
          <Input
            className="text-xl text-left font-normal border-none"
            placeholder="0"
          />
        </Box>

        <Box alignCenter col>
          <Typography className="pl-16" fontWeight="medium" variant="subtitle1">
            {'0'}
          </Typography>

          <Box>
            <AssetIcon asset={Asset.RUNE()} size={32} />
            <Box className="pl-2" alignCenter col>
              <Typography variant="subtitle1" fontWeight="semibold">
                {'THOR'}
              </Typography>
              <Typography variant="caption-xs">{'ERC20'}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  )
})
