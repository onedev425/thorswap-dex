import { memo, MouseEventHandler, useCallback, useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, IconName, Tooltip, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { getAmountFromString } from 'components/InputAmount/utils'
import { useTheme } from 'components/Theme/ThemeContext'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'

import {
  navigateToPoolDetail,
  navigateToEtherScanAddress,
} from 'settings/constants'

import { FeaturedAssetIcon } from './FeaturedAssetIcon'
import { AssetSelectType } from './types'

type Props = AssetSelectType & {
  select: (asset: Asset) => void
  style: NotWorth
}

export const AssetSelectItem = memo(
  ({
    asset,
    logoURI,
    style,
    provider,
    balance,
    select,
    value,
    cg,
    price,
  }: Props) => {
    const { isLight } = useTheme()
    const formatPrice = useFormatPrice()
    const { isMdActive } = useWindowSize()
    const address = asset.symbol.split('-')[1]

    const isThorchainProvider = useMemo(
      () => provider?.toLowerCase() === 'thorchain',
      [provider],
    )

    const navigateToTokenContract: MouseEventHandler<HTMLButtonElement> =
      useCallback(
        (e) => {
          e.stopPropagation()

          if (isThorchainProvider) {
            navigateToPoolDetail(asset)
          } else {
            navigateToEtherScanAddress(address.toLowerCase())
          }
        },
        [address, asset, isThorchainProvider],
      )

    const showInfoButton = useMemo(
      () => isMdActive && !!provider,
      [isMdActive, provider],
    )

    const serviceName = useMemo(
      () => (isThorchainProvider ? 'THORYield' : 'EtherScan'),
      [isThorchainProvider],
    )

    const checkType = useMemo(
      () => (isThorchainProvider ? 'pool' : 'address'),
      [isThorchainProvider],
    )

    const description = useMemo(() => {
      if (asset.isSynth) return `${asset.type}`

      const marketCap =
        cg?.market_cap && getAmountFromString(`${cg.market_cap}`, asset.decimal)

      return `${asset.type}${provider ? `(${provider})` : ''}${
        marketCap ? ` - MC: ${marketCap.toAbbreviate(2)}` : ''
      }${price ? `, ${formatPrice(price)}` : ''}`
    }, [
      asset.decimal,
      asset.isSynth,
      asset.type,
      cg,
      formatPrice,
      price,
      provider,
    ])

    const tokenInfoIcon: IconName = useMemo(() => {
      switch (checkType) {
        case 'pool':
          return 'thoryieldColor'
        case 'address':
          return isLight ? 'etherscan' : 'etherscanLight'
      }
    }, [checkType, isLight])

    return (
      <Box
        className="group hover:duration-150 transition w-full cursor-pointer dark:hover:bg-dark-border-primary hover:bg-light-bg-secondary"
        alignCenter
        style={style}
        onClick={() => select(asset)}
      >
        <Box flex={1} className="gap-x-3 pl-2">
          <Box center className="gap-x-2">
            <FeaturedAssetIcon assetString={asset.toString()} />
            <AssetIcon logoURI={logoURI} size={30} asset={asset} />
          </Box>

          <Box col>
            <Box alignCenter row>
              <Typography
                className="leading-[24px]"
                fontWeight="medium"
                variant="h4"
              >
                {asset.ticker}
              </Typography>

              <Box className="px-1 opacity-20 group-hover:opacity-100 transition">
                {showInfoButton && (
                  <Tooltip
                    content={`${t('views.swap.check', { checkType })} ${t(
                      'views.swap.onService',
                      { serviceName },
                    )}`}
                  >
                    <HoverIcon
                      onClick={navigateToTokenContract}
                      size={16}
                      iconName={tokenInfoIcon}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Typography
              className="leading-[14px]"
              variant="caption-xs"
              fontWeight="light"
              color={asset.isSynth ? 'primaryBtn' : 'secondary'}
              transform="uppercase"
            >
              {description}
            </Typography>
          </Box>
        </Box>

        <Box col justify="end" className="pr-6">
          <Typography
            variant="caption"
            color="secondary"
            className="text-right"
          >
            {balance?.gt(0) ? balance.toSignificant(6) : ''}
          </Typography>

          <Box justify="end" className="gap-x-1">
            <Typography variant="caption-xs" color="secondary">
              {value?.gt(0) ? `${formatPrice(value)} ` : ''}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  },
)
