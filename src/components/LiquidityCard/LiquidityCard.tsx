import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { AssetCard } from 'components/AssetCard'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import {
  Button,
  useCollapse,
  DashedDivider,
  Card,
  Box,
  Typography,
  Icon,
} from 'components/Atomic'
import { AssetDataType } from 'components/LiquidityCard/types'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

interface LiquidityCardProps {
  data: AssetDataType[]
}

export const LiquidityCard = ({ data }: LiquidityCardProps) => {
  const navigate = useNavigate()
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

  return (
    <Box justifyCenter col>
      <Card className="flex flex-col bg-light-gray-light dark:bg-dark-gray-light">
        <Box
          className="mx-4 my-4 md:mx-2 cursor-pointer"
          alignCenter
          justify="between"
          onClick={toggle}
        >
          <Box className="my-1" center>
            <Box className="mx-2" col>
              <AssetLpIcon
                inline
                asset1={data[0].asset}
                asset2={data[1].asset}
              />
            </Box>

            <Typography
              fontWeight="normal"
              className="mx-3 ml-4 sm:mx-1 md:text-xl"
            >
              {data[0].asset.symbol}
              {' / '}
              {data[1].asset.symbol}
            </Typography>
          </Box>

          <Box center>
            <Typography className="!text-blue">
              {t('views.liquidity.collapse')}
            </Typography>
            <Icon
              className={classNames('transform duration-300 ease', {
                '-rotate-180': isActive,
              })}
              name="chevronDown"
              color="blue"
            />
          </Box>
        </Box>

        <div
          className="flex flex-col overflow-hidden duration-300 ease-in-out transition-max-height"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <DashedDivider className="my-4" />

          <Box col className="gap-1">
            <Box justify="between">
              <Typography className="!text-dark-gray-primary">
                {t('views.liquidity.poolToken')}
              </Typography>
              <Typography>{'0.4207'}</Typography>
            </Box>

            {data.map((item) => (
              <AssetCard key={item.asset.symbol} {...item} />
            ))}

            <Box justify="between">
              <Typography className="!text-dark-gray-primary">
                {t('views.liquidity.poolShare')}
              </Typography>
              <Typography>{'<0.01%'}</Typography>
            </Box>
          </Box>
          <Box className="space-x-6 md:pr-0" pt={3} justifyCenter>
            <Button
              onClick={() =>
                navigate(
                  `${ROUTES.AddLiquidity}?input=${data[0].asset}&output=${data[1].asset}`,
                )
              }
              className="px-8 md:px-12"
              variant="primary"
              size="sm"
            >
              {t('views.liquidity.addButton')}
            </Button>
            <Button className="px-8 md:px-12" variant="secondary" size="sm">
              {t('views.liquidity.removeButton')}
            </Button>
          </Box>
        </div>
      </Card>
    </Box>
  )
}
