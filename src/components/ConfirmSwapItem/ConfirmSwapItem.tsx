import { shortenAddress } from 'utils/shortenAddress'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Button, Box, Typography, Icon } from 'components/Atomic'
import { swapItem } from 'components/ConfirmSwapItem/SwapAssetsData'
import { InfoRow } from 'components/InfoRow'

import { t } from 'services/i18n'

export const ConfirmSwapItem = () => {
  return (
    <div className="flex-1">
      {swapItem.map((item) => (
        <>
          <InfoRow
            label={item.title}
            value={
              <Box justify="between" alignCenter>
                <Typography fontWeight="semibold" className="mx-2">
                  {item.title === 'Recipent Address'
                    ? shortenAddress(item.amount)
                    : item.amount}
                  {item.asset?.symbol}
                </Typography>
                {item.asset && <AssetIcon size={28} asset={item.asset} />}
                {item.infoIcon && (
                  <Icon color="secondary" size={22} name={item.infoIcon} />
                )}
              </Box>
            }
          />
        </>
      ))}
      <div className="my-3">
        <Box className="gap-4" col>
          <Button
            stretch
            variant="tertiary"
            type="outline"
            endIcon={<Icon size={22} name="lock" className="ml-2" />}
          >
            {t('common.locked')}
          </Button>
          <Button stretch type="outline">
            {t('common.confirm')}
          </Button>
        </Box>
      </div>
    </div>
  )
}
