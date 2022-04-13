import { Box, Tooltip, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { HoverIcon } from 'components/HoverIcon'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { t } from 'services/i18n'

type Props = {
  type: 'short' | 'mini' | 'icon'
  address: string
}

export const CopyAddress = ({ type = 'icon', address }: Props) => {
  const { miniAddress, shortAddress, handleCopyAddress } =
    useAddressUtils(address)

  if (type === 'icon') {
    return (
      <HoverIcon
        iconName="copy"
        tooltip={t('views.wallet.copyAddress')}
        size={16}
        onClick={handleCopyAddress}
      />
    )
  }

  const displayAddress = type === 'mini' ? miniAddress : shortAddress

  return (
    <Tooltip content={t('views.wallet.copyAddress')}>
      <Box onClick={handleCopyAddress}>
        <Typography
          className={baseHoverClass}
          variant="caption"
          fontWeight="semibold"
        >
          {displayAddress}
        </Typography>
      </Box>
    </Tooltip>
  )
}
