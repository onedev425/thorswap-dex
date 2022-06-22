import { memo } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { thornameChainIcons } from 'views/Thorname/ChainDropdown'

import { Box, Collapse, Icon, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTable } from 'components/InfoTable'

import { useMidgard } from 'store/midgard/hooks'

import { useFetchThornames } from 'hooks/useFetchThornames'

import { t } from 'services/i18n'
import { getThornameExpireDate } from 'services/thorname'

import { shortenAddress } from 'helpers/shortenAddress'

type Props = {
  editThorname: (thorname: string) => void
}

export const RegisteredThornames = memo(({ editThorname }: Props) => {
  const thornames = useFetchThornames()
  const { lastBlock } = useMidgard()

  if (!thornames?.length) return null

  return (
    <Box col className="pt-8 w-full">
      <Typography variant="h5" className="pb-4">
        {t('views.thorname.myThornames')}
      </Typography>

      {thornames.map(({ thorname, expire, entries, owner }) => (
        <HighlightCard
          className="!p-0 my-2"
          key={`${thorname}-${owner}-${expire}`}
        >
          <Collapse
            className="!py-1"
            shadow={false}
            title={
              <Box flex={1} row justify="between" alignCenter className="gap-2">
                <Typography>{thorname}</Typography>
                <HoverIcon
                  iconName="edit"
                  size={16}
                  onClick={() => editThorname(thorname)}
                />
              </Box>
            }
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
        </HighlightCard>
      ))}
    </Box>
  )
})
