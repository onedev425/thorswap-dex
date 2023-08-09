import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { memo, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { Token } from 'store/thorswap/types';
import { useTokenAddresses } from 'views/Swap/hooks/useTokenAddresses';

import {
  isLedgerLiveSupportedInputAsset,
  isLedgerLiveSupportedOutputAsset,
} from '../../../ledgerLive/wallet/LedgerLive';

import { useAssetsWithBalanceFromTokens } from './hooks/useAssetsWithBalanceFromTokens';

const ConditionalWrapper = ({ children, condition }: { children: any; condition: boolean }) =>
  IS_LEDGER_LIVE && condition ? (
    <Tooltip className="mb-5" content={t('components.assetSelect.ledgerLiveSwitchNotSupported')}>
      {children}
    </Tooltip>
  ) : (
    children
  );
type Props = {
  onSwitchPair: (unsupported?: boolean) => void;
  onInputAssetChange: (asset: Asset) => void;
  onOutputAssetChange: (asset: Asset) => void;
  onInputAmountChange: (value: Amount) => void;
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  tokens: Token[];
};

export const AssetInputs = memo(
  ({
    inputAsset,
    outputAsset,
    onInputAssetChange,
    onOutputAssetChange,
    onInputAmountChange,
    onSwitchPair,
    tokens,
  }: Props) => {
    const [iconRotate, setIconRotate] = useState(false);

    const thorchainERC20SupportedAddresses = useTokenAddresses('Thorchain-supported-ERC20');
    const thorchainAvaxSupportedAddresses = useTokenAddresses('Thorchain-supported-ARC20');

    const isAssetSwitchPossible = useMemo(() => {
      return isLedgerLiveSupportedInputAsset(outputAsset);
    }, [outputAsset]);

    const handleAssetSwap = useCallback(() => {
      const inputAddress = inputAsset.asset.symbol.split('-')[1]?.toLowerCase();
      const unsupportedEthOutput =
        inputAsset.asset.L1Chain === Chain.Ethereum &&
        !isETHAsset(inputAsset.asset) &&
        !thorchainERC20SupportedAddresses.includes(inputAddress);

      const unsupportedAvaxOutput =
        inputAsset.asset.L1Chain === Chain.Avalanche &&
        !isAVAXAsset(inputAsset.asset) &&
        !thorchainAvaxSupportedAddresses.includes(inputAddress);

      onSwitchPair(unsupportedEthOutput || unsupportedAvaxOutput);
      setIconRotate((rotate) => !rotate);
    }, [
      inputAsset.asset,
      onSwitchPair,
      thorchainAvaxSupportedAddresses,
      thorchainERC20SupportedAddresses,
    ]);

    const assetList = useAssetsWithBalanceFromTokens(tokens);

    const { assetInputProps, assets } = useAssetListSearch(assetList);

    const outputAssets = useMemo(() => {
      if (
        (!thorchainERC20SupportedAddresses?.length && !thorchainAvaxSupportedAddresses?.length) ||
        (inputAsset.asset.L1Chain === Chain.Ethereum &&
          outputAsset.asset.L1Chain === Chain.Ethereum) ||
        (inputAsset.asset.L1Chain === Chain.Avalanche &&
          outputAsset.asset.L1Chain === Chain.Avalanche) ||
        (inputAsset.asset.L1Chain === Chain.BinanceSmartChain &&
          outputAsset.asset.L1Chain === Chain.BinanceSmartChain)
      ) {
        return assets;
      }

      const thorchainSupported = assets.filter(
        ({ asset }) =>
          isETHAsset(asset) ||
          isAVAXAsset(asset) ||
          ![Chain.Ethereum, Chain.Avalanche].includes(asset?.L1Chain) ||
          (asset?.L1Chain === Chain.Ethereum &&
            thorchainERC20SupportedAddresses.includes(asset.symbol.split('-')[1]?.toLowerCase())) ||
          (asset?.L1Chain === Chain.Avalanche &&
            thorchainAvaxSupportedAddresses.includes(asset.symbol.split('-')[1]?.toLowerCase())),
      );

      return thorchainSupported;
    }, [
      assets,
      inputAsset.asset.L1Chain,
      outputAsset.asset.L1Chain,
      thorchainAvaxSupportedAddresses,
      thorchainERC20SupportedAddresses,
    ]);

    return (
      <div className="relative self-stretch md:w-full">
        <Box
          center
          className={classNames(
            'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          )}
        >
          <ConditionalWrapper condition={!isAssetSwitchPossible}>
            <Box
              center
              className={classNames(
                isAssetSwitchPossible
                  ? 'cursor-pointer hover:brightness-125'
                  : 'cursor-not-allowed brightness-75 hover:brightness-100',
                'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'p-1 md:p-2 rounded-xl md:rounded-[18px]',
                'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent transition',
              )}
              onClick={isAssetSwitchPossible ? handleAssetSwap : undefined}
            >
              <Icon
                className={classNames('p-1 transition-all', {
                  '-scale-x-100': iconRotate,
                })}
                color="white"
                name="arrowDown"
                size={20}
              />
            </Box>
          </ConditionalWrapper>
        </Box>

        <AssetInput
          {...assetInputProps}
          assets={assets.filter(isLedgerLiveSupportedInputAsset)}
          className="!mb-1 flex-1 h-[111px]"
          onAssetChange={onInputAssetChange}
          onValueChange={onInputAmountChange}
          selectedAsset={inputAsset}
        />

        <AssetInput
          className="h-[111px]"
          {...assetInputProps}
          hideMaxButton
          assets={
            !IS_LEDGER_LIVE ? outputAssets : outputAssets.filter(isLedgerLiveSupportedOutputAsset)
          }
          onAssetChange={onOutputAssetChange}
          selectedAsset={outputAsset}
        />
      </div>
    );
  },
);
