import { memo } from 'react'

import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { thornameChainIcons } from 'views/Thorname/ChainDropdown'

import { Box, Collapse, Icon, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'

import { useMidgard } from 'store/midgard/hooks'

import { t } from 'services/i18n'
import { getThornameExpireDate } from 'services/thorname'

import { shortenAddress } from 'helpers/shortenAddress'

type Props = {
  thornames: (THORNameDetails & { thorname: string })[] | null
}

export const RegisteredThornames = memo(({ thornames }: Props) => {
  const { lastBlock } = useMidgard()

  if (!thornames?.length) return null

  return (
    <Box col className="pt-8 w-full">
      <Typography variant="h5">
        {t('views.thorname.registeredThornames')}
      </Typography>

      {thornames.map(({ thorname, expire, entries, owner }) => (
        <Collapse
          className="flex-1 self-stretch mt-2 bg-light-bg-secondary dark:bg-dark-bg-secondary"
          key={thorname}
          titleClassName="pl-4 pr-2"
          title={<Typography>{thorname}</Typography>}
        >
          <InfoTable
            items={[
              {
                label: t('views.thorname.expire'),
                value: getThornameExpireDate({
                  expire,
                  lastThorchainBlock: lastBlock?.[0]?.thorchain,
                }),
              },
              { label: t('views.thorname.owner'), value: owner },
              ...entries.map(({ address, chain }) => ({
                label: (
                  <Icon
                    className="px-2"
                    name={thornameChainIcons[chain as SupportedChain]}
                  />
                ),
                value: shortenAddress(address, 15),
              })),
            ]}
          />
        </Collapse>
      ))}
    </Box>
  )
})
