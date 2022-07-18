import { useMemo, useState } from 'react'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain, Chain } from '@thorswap-lib/types'

import { AssetIcon } from 'components/AssetIcon'
import { Box, DropdownMenu, Icon, Typography } from 'components/Atomic'

import { useGasRate } from 'hooks/useGasRate'

import { t } from 'services/i18n'

export const GasTracker = () => {
  const { chainGasRates } = useGasRate()
  const [activeChain, setActiveChain] = useState(Chain.Ethereum)

  const activeItem = useMemo(() => {
    const activeGasInfo = chainGasRates.filter(
      (item) => item.chain === activeChain,
    )?.[0]

    if (!activeGasInfo) {
      return (
        <Box className="gap-2 shadow-md" alignCenter row>
          <Icon name="gas" size={16} />
          <Typography variant="caption">{t('common.gasTracker')}</Typography>
        </Box>
      )
    }

    return (
      <Box row alignCenter>
        <AssetIcon
          className="mr-2"
          asset={chainToSigAsset(activeGasInfo.chain as SupportedChain)}
          size="tiny"
        />
        <Typography variant="caption">
          {`${activeGasInfo.gasRate.toFixed(2).replace(/\.?0+$/, '')} ${
            activeGasInfo.gasUnit
          }`}
        </Typography>
      </Box>
    )
  }, [activeChain, chainGasRates])

  const menuItems = useMemo(() => {
    return chainGasRates.map(({ chain, gasRate, gasUnit }) => {
      return {
        Component: (
          <Box row alignCenter>
            <AssetIcon
              className="mr-2"
              asset={chainToSigAsset(chain as SupportedChain)}
              size="tiny"
            />
            <Typography variant="caption">
              {`${gasRate.toFixed(2).replace(/\.?0+$/, '')} ${gasUnit}`}
            </Typography>
          </Box>
        ),
        value: chain,
      }
    })
  }, [chainGasRates])

  return (
    <DropdownMenu
      menuItems={menuItems}
      value={activeChain}
      openComponent={activeItem}
      onChange={(chain: string) => setActiveChain(chain as Chain)}
    />
  )
}
