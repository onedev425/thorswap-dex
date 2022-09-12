import { Amount, Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { AssetInputType } from 'components/AssetInput/types';
import { Box, Icon } from 'components/Atomic';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  onPoolChange: (asset: Asset) => void;
  onAssetAmountChange: (value: Amount) => void;
  onRuneAmountChange: (value: Amount) => void;
  poolAsset: AssetInputType;
  runeAsset: AssetInputType;
  poolAssetList: AssetInputType[];
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
    return (
      <Box col className="relative self-stretch w-full">
        <Box
          className={classNames(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[18px]',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
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
            assets={poolAssetList}
            className="!mb-1 flex-1"
            disabled={isAssetPending}
            maxButtonLabel={isRunePending ? t('pendingLiquidity.complete') : ''}
            onAssetChange={onPoolChange}
            onValueChange={onAssetAmountChange}
            selectedAsset={poolAsset}
            warning={
              isAssetPending ? t('pendingLiquidity.content', { asset: Asset.RUNE().ticker }) : ''
            }
          />
        </Box>

        <Box
          className={classNames('overflow-hidden h-[111px] transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.ASSET,
          })}
        >
          <AssetInput
            singleAsset
            className="!mb-1 flex-1"
            disabled={isRunePending}
            maxButtonLabel={isAssetPending ? t('pendingLiquidity.complete') : ''}
            onValueChange={onRuneAmountChange}
            selectedAsset={runeAsset}
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
