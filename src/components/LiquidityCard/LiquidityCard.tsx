import classNames from 'classnames'

import { DashedDivider } from 'views/Swap/DashedDivider'

import { AssetCard } from 'components/AssetCard'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import {
  Button,
  useCollapse,
  Card,
  Box,
  Typography,
  Icon,
} from 'components/Atomic'
import { AssetDataType } from 'components/LiquidityCard/types'

import { t } from 'services/i18n'

interface LiquidityCardProps {
  data: AssetDataType[]
}

export const LiquidityCard = ({ data }: LiquidityCardProps) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const { contentRef: buttonsContentRef, maxHeight: maxButtonHeight } =
    useCollapse()

  return (
    <Box justifyCenter col>
      <Card className="flex flex-col !bg-dark-gray-light mx-3">
        <Box className="mx-4 md:mx-2 my-4" alignCenter justify="between">
          <Box className="my-1" center>
            <Box className="mx-2" col>
              <AssetLpIcon
                asset1Name={data[0].assetTicker}
                asset2Name={data[1].assetTicker}
              />
            </Box>
            <Typography
              fontWeight="normal"
              className="mx-3 sm:mx-1 md:text-xl ml-4"
            >
              {data[0].assetTicker}
              {' / '}
              {data[1].assetTicker}
            </Typography>
          </Box>
          <Box className="cursor-pointer" center onClick={toggle}>
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
          className="flex flex-col transition-max-height overflow-hidden duration-300 ease-in-out transition-max-height"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <Box className="gap-1" col>
            <Box className="pt-4">
              <DashedDivider />
            </Box>
            <Box className="h-8" mt={26} alignCenter justify="between">
              <Typography className="!text-dark-gray-primary">
                {t('views.liquidity.poolToken')}
              </Typography>
              <Typography>{'0.4207'}</Typography>
            </Box>
            {data.map((item) => (
              <AssetCard key={item.assetTicker} {...item} />
            ))}
            <Box className="h-8" alignCenter justify="between">
              <Typography className="!text-dark-gray-primary">
                {t('views.liquidity.poolShare')}
              </Typography>
              <Typography>{'<0.01%'}</Typography>
            </Box>
          </Box>
        </div>
      </Card>

      <div
        className="overflow-hidden duration-300 ease-in-out transition-max-height"
        ref={buttonsContentRef}
        style={{
          maxHeight: `${isActive ? maxButtonHeight : 0}px`,
        }}
      >
        <Box className="space-x-6 md:pr-0" pt={3} mb={4} justifyCenter>
          <Button className="px-8 md:px-12" variant="primary" size="sm">
            {t('views.liquidity.addButton')}
          </Button>
          <Button className="px-8 md:px-12" variant="secondary" size="sm">
            {t('views.liquidity.removeButton')}
          </Button>
        </Box>
      </div>
    </Box>
  )
}
