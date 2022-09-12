import { chainToSigAsset, WalletOption } from '@thorswap-lib/multichain-core';
import { SupportedChain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { WalletIcon } from 'components/WalletIcon/WalletIcon';
import { chainName } from 'helpers/chainName';
import useWindowSize from 'hooks/useWindowSize';
import { memo } from 'react';
import { t } from 'services/i18n';

import { WalletType } from './types';

type Props = {
  disabled?: boolean;
  chain: SupportedChain;
  walletType?: WalletOption;
  selected: boolean;
  isChainAvailable: boolean;
  selectedWalletType?: WalletType;
  onClick: (chain: SupportedChain, skipReset: boolean) => () => void;
};

const ChainItem = ({
  disabled,
  selected,
  chain,
  selectedWalletType,
  isChainAvailable,
  onClick,
  walletType,
}: Props) => {
  const { isMdActive } = useWindowSize();

  return (
    <Box
      center
      className={classNames('relative px-2 py-3 cursor-pointer', {
        'opacity-30': disabled || (selectedWalletType && !isChainAvailable),
      })}
      flex={1}
      key={chain}
      onClick={disabled ? () => {} : onClick(chain, !!selectedWalletType && isChainAvailable)}
    >
      <Tooltip content={disabled ? t('common.comingSoon') : chainName(chain, true)}>
        <Box
          className={classNames('rounded-full p-[2.5px] border-transparent', {
            'bg-gradient-teal': selected,
          })}
        >
          <AssetIcon asset={chainToSigAsset(chain)} size={isMdActive ? 40 : 32} />

          <Box
            className={classNames(
              'opacity-0 duration-200 transition-all bg-light-layout-primary dark:bg-dark-bg-secondary',
              'absolute z-20 p-0.5 rounded-xl right-3',
              'border border-solid border-cyan',
              isMdActive ? 'top-9 right-2' : 'top-8 right-1',
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
