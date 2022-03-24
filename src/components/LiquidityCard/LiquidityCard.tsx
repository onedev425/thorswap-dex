import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import {
  Button,
  useCollapse,
  Card,
  Box,
  Typography,
  Icon,
  Link,
} from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'
import { InfoTable } from 'components/InfoTable'
import { AssetDataType } from 'components/LiquidityCard/types'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

interface LiquidityCardProps {
  data: AssetDataType[]
}

export const LiquidityCard = ({ data }: LiquidityCardProps) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

  const summary = [
    { label: t('views.liquidity.poolToken'), value: '0.4207' },
    {
      label: data[0].asset.symbol,
      value: (
        <Box className="gap-2" center>
          <Typography>{data[0].amount}</Typography>
          <AssetIcon size={27} asset={data[0].asset} />
        </Box>
      ),
    },
    {
      label: data[1].asset.symbol,
      value: (
        <Box className="gap-2" center>
          <Typography>{data[1].amount}</Typography>
          <AssetIcon size={27} asset={data[1].asset} />
        </Box>
      ),
    },
    { label: t('views.liquidity.poolShare'), value: '<0.01%' },
  ]

  return (
    <Box justifyCenter col>
      <Card
        className={classNames(
          'flex flex-col bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl',
          borderHoverHighlightClass,
        )}
      >
        <Box
          className="mx-4 my-4 md:mx-2 cursor-pointer"
          alignCenter
          justify="between"
          onClick={toggle}
        >
          <Box center>
            <Box className="mx-2" col>
              <AssetLpIcon
                inline
                asset1={data[0].asset}
                asset2={data[1].asset}
                size={isActive ? 40 : 32}
              />
            </Box>

            <Typography
              variant={isActive ? 'subtitle1' : 'body'}
              fontWeight="normal"
              className="mx-3 ml-4 transition-all"
            >
              {data[0].asset.symbol}
              {' / '}
              {data[1].asset.symbol}
            </Typography>
          </Box>

          <Box center>
            <Icon
              className={classNames('transform duration-300 ease', {
                '-rotate-180': isActive,
              })}
              name="chevronDown"
              color="secondary"
            />
          </Box>
        </Box>

        <div
          className="flex flex-col overflow-hidden duration-300 ease-in-out transition-max-height"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <Box className="pt-5 self-stretch">
            <InfoTable items={summary} horizontalInset />
          </Box>

          <Box className="space-x-6 md:pr-0 pt-5 md:pt-10" justifyCenter>
            <Link
              className="w-full"
              to={`${ROUTES.AddLiquidity}?input=${data[0].asset}`}
            >
              <Button
                className="px-8 md:px-12"
                variant="primary"
                size="sm"
                stretch
              >
                {t('views.liquidity.addButton')}
              </Button>
            </Link>
            <Link className="w-full" to="/withdraw-liquidity">
              <Button
                className="px-8 md:px-12"
                variant="tint"
                size="sm"
                stretch
              >
                {t('common.withdraw')}
              </Button>
            </Link>
          </Box>
        </div>
      </Card>
    </Box>
  )
}
