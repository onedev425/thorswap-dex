import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, IconName, Tooltip, Typography } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { getAmountFromString } from 'components/InputAmount/utils';
import { useTheme } from 'components/Theme/ThemeContext';
import { useFormatPrice } from 'helpers/formatPrice';
import useWindowSize from 'hooks/useWindowSize';
import { memo, MouseEventHandler, useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import {
  navigateToEtherScanAddress,
  navigateToPoolDetail,
  navigateToSnowtraceAddress,
} from 'settings/router';

import { FeaturedAssetIcon } from './FeaturedAssetIcon';
import { AssetSelectType } from './types';

type Props = AssetSelectType & {
  select: (asset: Asset) => void;
  style: NotWorth;
};

export const AssetSelectItem = memo(
  ({ asset, logoURI, style, provider, balance, select, value, cg, price, identifier }: Props) => {
    const { isLight } = useTheme();
    const formatPrice = useFormatPrice();
    const { isMdActive } = useWindowSize();
    const address = asset.symbol.split('-')[1];
    const assetChain = provider?.toLowerCase() === 'thorchain' ? Chain.THORChain : asset.chain;

    const navigateToTokenContract: MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        e.stopPropagation();
        switch (assetChain) {
          case Chain.Ethereum:
            return navigateToEtherScanAddress(address.toLowerCase());
          case Chain.Avalanche:
            return navigateToSnowtraceAddress(address.toLowerCase());

          default:
            return navigateToPoolDetail(asset);
        }
      },
      [address, asset, assetChain],
    );

    const showInfoButton = useMemo(() => isMdActive && !!provider, [isMdActive, provider]);

    const serviceName = useMemo(() => {
      switch (assetChain) {
        case Chain.THORChain:
          return 'THORYield';
        case Chain.Avalanche:
          return 'Snowtrace';
        default:
          return 'EtherScan';
      }
    }, [assetChain]);

    const description = useMemo(() => {
      if (asset.isSynth) return `${asset.type}`;

      const marketCap =
        cg?.market_cap && getAmountFromString(`${cg.market_cap}`, asset.decimal)?.toAbbreviate(2);

      return `${asset.type}${marketCap ? ` - MC: ${marketCap}` : ''}${
        price ? `, ${formatPrice(price)}` : ''
      }`;
    }, [asset.decimal, asset.isSynth, asset.type, cg?.market_cap, formatPrice, price]);

    const tokenInfoIcon: IconName = useMemo(() => {
      switch (assetChain) {
        case Chain.Ethereum:
          return isLight ? 'etherscan' : 'etherscanLight';
        case Chain.Avalanche:
          return 'snowtrace';
        default:
          return 'thoryieldColor';
      }
    }, [assetChain, isLight]);

    const checkType = assetChain === Chain.THORChain ? 'pool' : 'address';

    const assetName = useMemo(() => {
      if (!cg?.name) return '';
      const assetLength = cg.name.length;
      return assetLength > 26 ? `${cg.name.slice(0, 26)}...` : cg.name;
    }, [cg?.name]);

    return (
      <Box
        alignCenter
        className="group hover:duration-150 transition w-full cursor-pointer dark:hover:bg-dark-border-primary hover:bg-light-bg-secondary"
        onClick={() => select(asset)}
        style={style}
      >
        <Box className="gap-x-3 pl-2" flex={1}>
          <Box center className="gap-x-2">
            <FeaturedAssetIcon assetString={`${asset?.symbol}-${identifier}`} />
            <AssetIcon asset={asset} logoURI={logoURI} size={30} />
          </Box>

          <Box col>
            <Box alignCenter row className="gap-x-1">
              <Typography fontWeight="medium" variant="h4">
                {asset.ticker}
              </Typography>
              <Typography
                className="h-6 overflow-hidden"
                color="secondary"
                fontWeight="medium"
                variant="subtitle1"
              >
                {assetName}
              </Typography>

              <Box className="opacity-40 group-hover:opacity-100 transition">
                {showInfoButton && (
                  <Tooltip
                    content={`${t('views.swap.check', {
                      checkType,
                    })} ${t('views.swap.onService', {
                      serviceName,
                    })}`}
                  >
                    <HoverIcon
                      iconName={tokenInfoIcon}
                      onClick={navigateToTokenContract}
                      size={16}
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Typography
              className="leading-[14px]"
              color={asset.isSynth ? 'primaryBtn' : 'secondary'}
              fontWeight="light"
              transform="uppercase"
              variant="caption-xs"
            >
              {description}
            </Typography>
          </Box>
        </Box>

        <Box col className="pr-6" justify="end">
          <Typography className="text-right" color="secondary" variant="caption">
            {balance?.gt(0) ? balance.toSignificant(6) : ''}
          </Typography>

          <Box className="gap-x-1" justify="end">
            <Typography color="secondary" variant="caption-xs">
              {value?.gt(0) ? `${formatPrice(value)} ` : ''}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  },
);
