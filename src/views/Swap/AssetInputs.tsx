import type { AssetValue, SwapKitNumber } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import type { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { isAVAXAsset, isBSCAsset, isETHAsset } from 'helpers/assets';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { memo, useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import type { Token } from 'store/thorswap/types';
import { useTokenAddresses } from 'views/Swap/hooks/useTokenAddresses';

import {
  isLedgerLiveSupportedInputAsset,
  isLedgerLiveSupportedOutputAsset,
} from '../../../ledgerLive/wallet/LedgerLive';

import { useAssetsWithBalanceFromTokens } from './hooks/useAssetsWithBalanceFromTokens';

const ConditionalWrapper = ({ children, condition }: { children: Todo; condition: boolean }) =>
  IS_LEDGER_LIVE && condition ? (
    <Tooltip className="mb-5" content={t('components.assetSelect.ledgerLiveSwitchNotSupported')}>
      {children}
    </Tooltip>
  ) : (
    children
  );
type Props = {
  onSwitchPair: (unsupported?: boolean) => void;
  onInputAssetChange: (asset: AssetValue) => void;
  onOutputAssetChange: (asset: AssetValue) => void;
  onInputAmountChange: (value: SwapKitNumber) => void;
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  tokens: Token[];
  tradingPairs?: Token[];
};

const Inputs = ({
  inputAsset,
  outputAsset,
  onInputAssetChange,
  onOutputAssetChange,
  onInputAmountChange,
  onSwitchPair,
  tokens,
  tradingPairs,
}: Props) => {
  const [iconRotate, setIconRotate] = useState(false);

  const thorchainEVNSupportedAddresses = useTokenAddresses('tokens');

  const isAssetSwitchPossible = useMemo(() => {
    return isLedgerLiveSupportedInputAsset(outputAsset.asset);
  }, [outputAsset]);

  const handleAssetSwap = useCallback(() => {
    onSwitchPair();
    setIconRotate((rotate) => !rotate);
  }, [onSwitchPair]);

  const inputAssetList = useAssetsWithBalanceFromTokens(tokens);
  const outputAssetList = useAssetsWithBalanceFromTokens(tradingPairs || tokens);

  const { assetInputProps, assets } = useAssetListSearch(inputAssetList);
  const { assetInputProps: outputAssetInputProps, assets: outputAssetsSearched } =
    useAssetListSearch(outputAssetList);

  const outputAssets = useMemo(() => {
    if (
      !thorchainEVNSupportedAddresses?.length ||
      (inputAsset.asset.chain === Chain.Ethereum && outputAsset.asset.chain === Chain.Ethereum) ||
      (inputAsset.asset.chain === Chain.Avalanche && outputAsset.asset.chain === Chain.Avalanche) ||
      (inputAsset.asset.chain === Chain.BinanceSmartChain &&
        outputAsset.asset.chain === Chain.BinanceSmartChain) ||
      inputAsset.asset.isGasAsset
    ) {
      return outputAssetsSearched;
    }

    const thorchainSupported = outputAssetsSearched.filter(
      ({ asset }) =>
        isETHAsset(asset) ||
        isAVAXAsset(asset) ||
        isBSCAsset(asset) ||
        ![Chain.Ethereum, Chain.Avalanche, Chain.BinanceSmartChain].includes(asset?.chain) ||
        thorchainEVNSupportedAddresses.includes(asset.symbol.split('-')[1]?.toLowerCase()),
    );

    return thorchainSupported;
  }, [
    outputAssetsSearched,
    inputAsset.asset?.chain,
    inputAsset.asset?.isGasAsset,
    outputAsset.asset?.chain,
    thorchainEVNSupportedAddresses,
  ]);

  return (
    <div className="relative self-stretch md:w-full">
      <Box
        center
        className={classNames('absolute mt-2.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
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
        hideZeroPrice
        assets={assets.filter((asset) => isLedgerLiveSupportedInputAsset(asset.asset))}
        className="!mb-1 flex-1 h-[100px]"
        onAssetChange={onInputAssetChange}
        onValueChange={onInputAmountChange}
        selectedAsset={inputAsset}
      />

      <AssetInput
        {...outputAssetInputProps}
        hideMaxButton
        hideZeroPrice
        assets={
          !IS_LEDGER_LIVE
            ? outputAssets
            : outputAssets.filter((outputAsset) =>
                isLedgerLiveSupportedOutputAsset(outputAsset.asset),
              )
        }
        className="h-[90px]"
        onAssetChange={onOutputAssetChange}
        selectedAsset={outputAsset}
      />
    </div>
  );
};

export const AssetInputs = memo(Inputs);
