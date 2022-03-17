import { memo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box, Card, Icon, Typography, useCollapse } from 'components/Atomic'
import { Information } from 'components/Information'

import { t } from 'services/i18n'

const data = [
  { title: 'Slip', amount: '0.54' },
  { title: 'Pool Share Estimated', amount: '8.248' },
  { title: t('common.transactionFee'), amount: '0.02 RUNE' },
]

export const PendingTile = memo(() => {
  const { contentRef, toggle, maxHeightStyle, collapseClasses, isActive } =
    useCollapse()

  return (
    <Card className="self-stretch bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col">
      <Box className="cursor-pointer" alignCenter justify="between">
        <Box col>
          <Typography variant="subtitle1" fontWeight="medium">
            {t('views.pendingLiquidity.pending')} {'($335.39 k)'}
          </Typography>
          <Typography>{'22,212.2'}</Typography>
        </Box>

        <Box className="gap-2" alignCenter>
          <Box alignCenter col>
            <Typography
              className="pl-16"
              variant="subtitle1"
              fontWeight="semibold"
            >
              {'0.01'}
            </Typography>

            <Box>
              <AssetIcon asset={Asset.RUNE()} size={32} />

              <Box className="pl-2" alignCenter col>
                <Typography variant="subtitle1" fontWeight="semibold">
                  {'THOR'}
                </Typography>
                <Typography className="" variant="caption-xs">
                  {'ERC20'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Icon
            name="chevronDown"
            color="secondary"
            onClick={toggle}
            className={classNames('transform duration-300 ease inline-block', {
              '-rotate-180': isActive,
            })}
          />
        </Box>
      </Box>

      <div className={collapseClasses} ref={contentRef} style={maxHeightStyle}>
        <Box className="pt-4 gap-y-2" col>
          {data.map((item) => (
            <Information
              key={item.title}
              label={item.title}
              value={
                <Box className="gap-2">
                  <Typography>{`${item.amount} %`}</Typography>
                  <Icon color="secondary" size={20} name="infoCircle" />
                </Box>
              }
            />
          ))}
        </Box>
      </div>
    </Card>
  )
})
