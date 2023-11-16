import type { AssetValue, SwapKitNumber } from '@swapkit/core';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import type { AssetInputType } from 'components/AssetInput/types';
import type { AssetSelectType } from 'components/AssetSelect/types';
import { Box, Icon } from 'components/Atomic';
import { RUNEAsset } from 'helpers/assets';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { memo } from 'react';
import { t } from 'services/i18n';
import { LiquidityTypeOption } from 'store/midgard/types';

type Props = {
  onPoolChange: (asset: AssetValue) => void;
  onAssetAmountChange: (value: SwapKitNumber) => void;
  onRuneAmountChange: (value: SwapKitNumber) => void;
  poolAsset: AssetInputType;
  runeAsset: AssetInputType;
  poolAssetList: AssetSelectType[];
  liquidityType: LiquidityTypeOption;
  isRunePending: boolean;
  isAssetPending: boolean;
};

export const AssetInputs = memo(
  ({
    poolAsset,
    runeAsset,
    poolAssetList,
    onAssetAmountChange,
    onRuneAmountChange,
    onPoolChange,
    liquidityType,
    isAssetPending,
    isRunePending,
  }: Props) => {
    const { assetInputProps, assets } = useAssetListSearch(poolAssetList);

    return (
      <Box col className="relative self-stretch w-full">
        <Box
          className={classNames(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[18px]',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent',
            'opacity-100 scale-100 transition-all',
            {
              '!scale-0 !opacity-0': liquidityType !== LiquidityTypeOption.SYMMETRICAL,
            },
          )}
        >
          <Icon className={classNames('w-7 h-7')} color="white" name="plus" />
        </Box>

        <Box
          className={classNames('overflow-hidden h-[111px] transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.RUNE,
          })}
        >
          <AssetInput
            {...assetInputProps}
            assets={assets}
            className="!mb-1 flex-1"
            disabled={isAssetPending}
            maxButtonLabel={isRunePending ? t('pendingLiquidity.complete') : ''}
            onAssetChange={onPoolChange}
            onValueChange={onAssetAmountChange}
            selectedAsset={poolAsset}
            warning={
              isAssetPending ? t('pendingLiquidity.content', { asset: RUNEAsset.ticker }) : ''
            }
          />
        </Box>

        <Box
          className={classNames('overflow-hidden transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.ASSET,
            'h-[111px] ': liquidityType !== LiquidityTypeOption.RUNE,
            'h-[140px] md:h-[111px]': liquidityType === LiquidityTypeOption.RUNE,
          })}
        >
          <AssetInput
            singleAsset
            assets={poolAssetList}
            className="!mb-1 flex-1"
            disabled={isRunePending}
            maxButtonLabel={isAssetPending ? t('pendingLiquidity.complete') : ''}
            onAssetChange={onPoolChange}
            onValueChange={onRuneAmountChange}
            poolAsset={poolAsset}
            selectedAsset={runeAsset}
            showSecondaryChainSelector={liquidityType === LiquidityTypeOption.RUNE}
            warning={
              isRunePending
                ? t('pendingLiquidity.content', {
                    asset: poolAsset.asset.ticker,
                  })
                : ''
            }
          />
        </Box>
      </Box>
    );
  },
);
