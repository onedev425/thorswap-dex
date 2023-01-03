import { Flex } from '@chakra-ui/react';
import { Amount, Asset, Price } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { useMidgard } from 'store/midgard/hooks';
import { PositionTooSmallInfo } from 'views/Earn/PositionTooSmallInfo';
import { SaverPosition } from 'views/Earn/types';
import { useEarnCalculations } from 'views/Earn/useEarnCalculations';

type Props = {
  position: SaverPosition;
  withdraw: (asset: Asset) => void;
  deposit: (asset: Asset) => void;
};

export const EarnPosition = ({ position, withdraw, deposit }: Props) => {
  const { pools } = useMidgard();
  const { networkFee } = useEarnCalculations({
    asset: position.asset,
    amount: position.amount,
    isDeposit: false,
  });

  const positionTooSmall = networkFee.gte(position?.amount);

  const amountUsd = useCallback(
    (amount: Amount) => {
      return new Price({
        baseAsset: position.asset,
        pools,
        priceAmount: amount,
      });
    },
    [pools, position.asset],
  );

  const infoFields: InfoRowConfig[] = [
    {
      label: 'Amount Deposited',
      value: (
        <InfoWithTooltip
          icon="usdCircle"
          tooltip={`$${amountUsd(position.depositAmount).toFixedRaw(2)}`}
          value={`${position.depositAmount.toSignificantWithMaxDecimals(6)} ${
            position.asset.symbol
          }`}
        />
      ),
    },
    {
      label: 'Amount Redeemable',
      value: !positionTooSmall ? (
        <InfoWithTooltip
          icon="usdCircle"
          tooltip={amountUsd(position.amount).toCurrencyFormat(2)}
          value={`${position?.amount?.toSignificantWithMaxDecimals(6)} ${position.asset.symbol}`}
        />
      ) : (
        <PositionTooSmallInfo />
      ),
    },
    {
      label: 'Total Earned',
      value:
        position?.earnedAmount && !positionTooSmall ? (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.earnedAmount).toCurrencyFormat(2)}
            value={`${position?.earnedAmount?.toSignificantWithMaxDecimals(6)} ${
              position.asset.symbol
            }`}
          />
        ) : (
          <PositionTooSmallInfo />
        ),
    },
  ];

  return (
    <Box col justifyCenter className="self-stretch" key={position.asset.toString()}>
      <HighlightCard className="!rounded-2xl pt-2 !pb-0 !gap-0" type="primary">
        <Box alignCenter className="cursor-pointer" justify="between">
          <Box alignCenter flex={1} justify="between">
            <Box center>
              <Box col>
                <AssetIcon asset={position.asset} size={32} />
              </Box>

              <Typography
                className={classNames('mx-1 md:mx-3 !transition-all')}
                fontWeight="semibold"
              >
                {position.asset.name}
              </Typography>
            </Box>

            {!positionTooSmall ? (
              <Flex>
                <Typography fontWeight="bold">
                  {position.amount?.toSignificantWithMaxDecimals(6) || 'n/a'} {position.asset.name}
                </Typography>
                <Typography>&nbsp;</Typography>
                <Typography fontWeight="light">{`($${amountUsd(position.amount).toFixedRaw(
                  2,
                )})`}</Typography>
              </Flex>
            ) : (
              <PositionTooSmallInfo />
            )}
          </Box>
        </Box>

        <Box className="gap-2">
          <InfoTable horizontalInset className="my-3" items={infoFields} size="sm" />

          <Box col justifyCenter className="gap-1">
            <Button
              stretch
              className="!h-[32px]"
              onClick={() => {
                deposit(position.asset);
              }}
              variant="primary"
            >
              {t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="md:min-w-[100px] !h-[32px]"
              onClick={() => {
                withdraw(position.asset);
              }}
              type="outline"
              variant="secondary"
            >
              {t('common.withdraw')}
            </Button>
          </Box>
        </Box>
      </HighlightCard>
    </Box>
  );
};
