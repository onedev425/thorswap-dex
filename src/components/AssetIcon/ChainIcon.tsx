import { Chain, SupportedChain } from '@thorswap-lib/types';
import { Box, Icon, IconName } from 'components/Atomic';
import { memo, useMemo } from 'react';

type ChainIconProps = {
  chain: SupportedChain;
  size?: number;
  style?: React.CSSProperties;
};

export const ChainIcon = memo(({ chain, style, size = 16 }: ChainIconProps) => {
  const chainIcon: IconName = useMemo(() => {
    switch (chain) {
      case Chain.Ethereum:
        return 'ethereum' as IconName;

      case Chain.Cosmos:
        return 'cos' as IconName;

      default:
        return chain.toLowerCase() as IconName;
    }
  }, [chain]);

  return (
    <Box
      center
      className="rounded-full bg-light-gray-light dark:bg-dark-gray-light absolute z-10 scale-[65%]"
      style={style}
    >
      <Icon className="p-0.5" name={chainIcon} size={size} />
    </Box>
  );
});
