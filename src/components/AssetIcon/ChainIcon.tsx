import type { Chain } from '@swapkit/core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon/AssetIcon';
import { Box } from 'components/Atomic';
import { getChainIdentifier } from 'helpers/chains';
import { tokenLogoURL } from 'helpers/logoURL';
import { memo, useMemo } from 'react';

type ChainIconProps = {
  chain: Chain;
  size?: number;
  withoutBackground?: boolean;
  style?: React.CSSProperties;
};

export const FORCE_ICON_CHAINS = [];

const Icon = ({ withoutBackground = false, chain, style, size = 16 }: ChainIconProps) => {
  const logoURI = useMemo(
    () => tokenLogoURL({ identifier: getChainIdentifier(chain), isChainBadge: true }),
    [chain],
  );

  return (
    <Box
      center
      className={classNames({
        'rounded-full scale-[65%] bg-light-gray-light dark:bg-dark-gray-light absolute z-10':
          !withoutBackground,
      })}
      style={style}
    >
      <AssetIcon hasChainIcon={false} logoURI={logoURI} size={size} />
    </Box>
  );
};

export const ChainIcon = memo(Icon);
