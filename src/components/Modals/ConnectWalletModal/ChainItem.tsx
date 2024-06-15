import type { Chain } from '@swapkit/core';
import classNames from 'classnames';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { WalletIcon } from 'components/WalletIcon/WalletIcon';
import { chainName } from 'helpers/chainName';
import useWindowSize from 'hooks/useWindowSize';
import { memo } from 'react';
import { t } from 'services/i18n';
import type { SupportedWalletOptions } from 'store/thorswap/types';

import type { WalletType } from './types';

type Props = {
  disabled?: boolean;
  chain: Chain;
  walletType?: SupportedWalletOptions;
  selected: boolean;
  isChainAvailable: boolean;
  selectedWalletType?: WalletType;
  tooltip?: string;
  onClick: (chain: Chain, skipReset: boolean) => () => void;
};

const ChainItem = ({
  disabled,
  selected,
  chain,
  selectedWalletType,
  isChainAvailable,
  onClick,
  tooltip,
  walletType,
}: Props) => {
  const { isMdActive } = useWindowSize();

  return (
    <Box
      center
      className={classNames('p-1.5 relative md:px-2 md:py-3 cursor-pointer', {
        'opacity-30': disabled || (selectedWalletType && !isChainAvailable),
      })}
      key={chain}
      onClick={disabled ? () => {} : onClick(chain, !!selectedWalletType && isChainAvailable)}
    >
      <Tooltip content={tooltip || (disabled ? t('common.comingSoon') : chainName(chain, true))}>
        <Box
          className={classNames('rounded-full p-[3px] border-transparent', {
            'bg-gradient-teal': selected,
          })}
        >
          <ChainIcon withoutBackground chain={chain} size={isMdActive ? 42 : 32} />

          <Box
            className={classNames(
              'opacity-0 duration-200 transition-all bg-light-layout-primary dark:bg-dark-bg-secondary',
              'absolute z-20 p-0.5 rounded-xl right-3',
              'border border-solid border-cyan',
              isMdActive ? 'top-10 right-2.5' : 'top-8 right-1',
              { '!opacity-100': selected },
            )}
          >
            <Icon color="cyan" name="connect" size={14} />
          </Box>

          <Box
            className={classNames(
              'opacity-0 duration-200 transition-all bg-light-layout-primary dark:bg-dark-bg-secondary',
              'absolute z-20 p-0.5 rounded-xl top-0',
              isMdActive ? 'top-2 left-2.5' : 'left-1',
              { '!opacity-100': walletType },
            )}
          >
            <WalletIcon size={16} walletType={walletType} />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default memo(ChainItem);
