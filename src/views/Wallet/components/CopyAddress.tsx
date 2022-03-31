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
  const { handleCopyAddress, miniAddress, shortAddress } =
    useAddressUtils(address)

  if (type === 'icon') {
    return (
      <HoverIcon
        iconName="copy"
        tooltip={t('views.wallet.copyAddress')}
        onClick={handleCopyAddress}
        size={16}
      />
    )
  }

  const displayAddress = type === 'mini' ? miniAddress : shortAddress

  return (
    <Tooltip content="Copy">
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
