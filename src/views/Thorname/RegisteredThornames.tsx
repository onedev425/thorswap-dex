import { memo } from 'react'

import { SupportedChain } from '@thorswap-lib/types'

import { thornameChainIcons } from 'views/Thorname/ChainDropdown'

import { Box, Collapse, Icon, Tooltip, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTable } from 'components/InfoTable'
import { Scrollbar } from 'components/Scrollbar'

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

      <Scrollbar secondary scrollClassName="!mr-2" maxHeight="60vh">
        {thornames.map(({ thorname, expire, entries, owner }) => (
          <HighlightCard
            className="!p-0 m-2"
            key={`${thorname}-${owner}-${expire}`}
          >
            <Collapse
              className="!py-1"
              shadow={false}
              title={
                <Box
                  flex={1}
                  row
                  justify="between"
                  alignCenter
                  className="gap-2"
                >
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
                    value: (
                      <Box className="gap-x-2" center>
                        <Tooltip
                          iconName="infoCircle"
                          content={t('views.thorname.expirationNote', {
                            block: expire,
                          })}
                        />
                        <Typography>
                          {getThornameExpireDate({
                            expire,
                            lastThorchainBlock: lastBlock?.[0]?.thorchain,
                          })}
                        </Typography>
                      </Box>
                    ),
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
      </Scrollbar>
    </Box>
  )
})
