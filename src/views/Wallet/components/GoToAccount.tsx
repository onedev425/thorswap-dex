import { useMemo } from 'react'

import { SupportedChain } from '@thorswap-lib/types'

import { HoverIcon } from 'components/HoverIcon'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

type Props = {
  chain: SupportedChain
  address: string
}

export const GoToAccount = ({ chain, address }: Props) => {
  const accountUrl = useMemo(
    () => multichain.getExplorerAddressUrl(chain, address),
    [chain, address],
  )

  return (
    <HoverIcon
      href={accountUrl}
      iconName="external"
      tooltip={t('views.wallet.goToAccount')}
      size={16}
    />
  )
}
