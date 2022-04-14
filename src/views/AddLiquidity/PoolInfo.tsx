import { memo } from 'react'

import { Box, Collapse, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  poolTicker: string
  runeTicker: string
  poolShare: string | null
  fee: string | null
  slippage: string | null
  rate: string | null
}

const borderClasses =
  'gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray'

export const PoolInfo = memo(
  ({ poolTicker, runeTicker, poolShare, slippage, fee, rate }: Props) => {
    const fields = [
      {
        label: `${runeTicker} ${t('common.per')} ${poolTicker}`,
        value: rate || 'N/A',
      },
      { label: t('views.wallet.slip'), value: slippage || 'N/A' },
      { label: t('common.fee'), value: fee || 'N/A' },
      {
        label: t('views.addLiquidity.shareOfPool'),
        value: poolShare || 'N/A',
      },
    ]

    return (
      <Collapse
        className="self-stretch !mt-0 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <Box row className="gap-x-2">
            <Icon name="infoCircle" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {t('views.addLiquidity.pricesAndPoolShare')}
            </Typography>
          </Box>
        }
      >
        <Box className="w-full">
          {fields.map(({ label, value }, index) => {
            const first = index === 0
            const last = index === fields.length - 1

            return (
              <Box
                col
                key="label"
                flex={1}
                alignCenter={!(first || last)}
                justify="between"
                className={last ? 'text-right' : borderClasses}
              >
                <Typography
                  variant="caption"
                  color="secondary"
                  fontWeight="semibold"
                >
                  {label}
                </Typography>

                <Typography variant="h4" className="text-base md:text-h4">
                  {value}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Collapse>
    )
  },
)
