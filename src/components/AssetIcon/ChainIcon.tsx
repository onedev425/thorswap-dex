import { Chain } from '@thorswap-lib/types';
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

export const ChainIcon = memo(
  ({ withoutBackground = false, chain, style, size = 16 }: ChainIconProps) => {
    const identifier = useMemo(() => {
      return getChainIdentifier(chain);
    }, [chain]);

    return (
      <Box
        center
        className={classNames({
          'rounded-full scale-[65%] bg-light-gray-light dark:bg-dark-gray-light absolute z-10':
            !withoutBackground,
        })}
        style={style}
      >
        <AssetIcon logoURI={tokenLogoURL({ identifier })} size={size} />
      </Box>
    );
  },
);
