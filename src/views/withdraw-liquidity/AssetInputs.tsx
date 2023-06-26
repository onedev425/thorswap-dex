import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { WithdrawPercent } from 'components/WithdrawPercent';
import { RUNEAsset } from 'helpers/assets';
import { memo } from 'react';
import { t } from 'services/i18n';
import { LiquidityTypeOption } from 'store/midgard/types';

import { AssetAmountBox } from './AssetAmountBox';

type Props = {
  poolAsset: AssetEntity;
  percent: Amount;
  runeAmount: Amount;
  assetAmount: Amount;
  onPercentChange: (value: Amount) => void;
  liquidityType: LiquidityTypeOption;
};

export const AssetInputs = memo(
  ({ onPercentChange, percent, poolAsset, runeAmount, assetAmount, liquidityType }: Props) => {
    return (
      <div className="relative self-stretch md:w-full">
        <div
          className={classNames(
            'absolute flex items-center justify-center top-1/2 rounded-3xl left-1/2 -translate-y-2 -translate-x-1/2 w-[52px] h-[52px]',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon color="white" name="arrowDown" size={20} />
        </div>

        <WithdrawPercent onChange={onPercentChange} percent={percent} />

        <HighlightCard className="min-h-[107px] p-4 flex-col md:flex-row items-end md:items-center gap-2">
          <Box>
            <Text className="whitespace-nowrap">{`${t('common.receive')}:`}</Text>
          </Box>

          <Box className="gap-2 py-1 flex-1 self-stretch md:self-center">
            <Box
              className={classNames('overflow-hidden transition-all origin-left', {
                'scale-x-0': liquidityType === LiquidityTypeOption.RUNE,
              })}
              flex={liquidityType === LiquidityTypeOption.RUNE ? 0 : 1}
            >
              <AssetAmountBox stretch amount={assetAmount.toSignificant(6)} asset={poolAsset} />
            </Box>

            <Box
              className={classNames('overflow-hidden transition-all origin-right', {
                'scale-x-0': liquidityType === LiquidityTypeOption.ASSET,
              })}
              flex={liquidityType === LiquidityTypeOption.ASSET ? 0 : 1}
            >
              <AssetAmountBox stretch amount={runeAmount.toSignificant(6)} asset={RUNEAsset} />
            </Box>
          </Box>
        </HighlightCard>
      </div>
    );
  },
);
