import { shortenAddress } from 'utils/shortenAddress'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Button, Box, Typography, Icon } from 'components/Atomic'
import { swapItem } from 'components/ConfirmSwapItem/SwapAssetsData'
import { Information } from 'components/Information'

import { t } from 'services/i18n'

export const ConfirmSwapItem = () => {
  return (
    <div className="flex-1">
      {swapItem.map((item) => (
        <>
          <Information
            label={item.title}
            value={
              <Box justify="between" alignCenter>
                <Typography fontWeight="semibold" className="mx-2">
                  {item.title === 'Recipent Address'
                    ? shortenAddress(item.amount)
                    : item.amount}
                  {item.assetTicker}
                </Typography>
                {item.icon && <AssetIcon size={28} name={item.icon} />}
                {item.infoIcon && (
                  <Icon color="secondary" size={22} name={item.infoIcon} />
                )}
              </Box>
            }
          />
        </>
      ))}
      <div className="my-3">
        <Box className="gap-4" col center>
          <Button
            className="px-7 h-[40px] mb-8 mt-3 !rounded-xl"
            variant="tertiary"
            type="outline"
          >
            <Box className="space-x-44" alignCenter justify="between">
              <Typography
                fontWeight="semibold"
                className="mr-4"
                color="secondary"
                variant="body"
              >
                {t('common.locked')}
              </Typography>
              <Icon size={22} name="lock" className="ml-2" />
            </Box>
          </Button>
          <Button className="px-32" type="outline">
            {t('common.confirm')}
          </Button>
        </Box>
      </div>
    </div>
  )
}
