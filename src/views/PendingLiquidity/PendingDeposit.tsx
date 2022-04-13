import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Button, Icon, Typography, useCollapse } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'

import { t } from 'services/i18n'

export const PendingDeposit = memo(() => {
  const { contentRef, isActive, toggle, maxHeightStyle } = useCollapse()

  return (
    <HighlightCard className="self-stretch p-2 md:!pb-1">
      <Box onClick={toggle} className="cursor-pointer" justify="between">
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

        <Box justify="start">
          <Typography
            className="hidden sm:flex"
            variant="subtitle1"
            fontWeight="medium"
          >
            {`${t('views.pendingLiquidity.pending')} 22,212.2 ${t(
              'views.pendingLiquidity.assetTicker',
            )}`}
          </Typography>
          <Icon className="px-2" color="secondary" name="share" size={20} />

          <Icon
            className={classNames('transform duration-300 ease', {
              '-rotate-180': isActive,
            })}
            name="chevronDown"
            color="secondary"
          />
        </Box>
      </Box>

      <div ref={contentRef} style={maxHeightStyle}>
        <Box className="gap-6 !mt-4 pb-2" justifyCenter>
          <Button size="md">{t('views.pendingLiquidity.complete')}</Button>

          <Button variant="secondary" size="md">
            {t('views.pendingLiquidity.withdraw')}
          </Button>
        </Box>
      </div>
    </HighlightCard>
  )
})
