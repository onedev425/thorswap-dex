import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { t } from 'services/i18n';
import { PositionTooSmallInfo } from 'views/Earn/PositionTooSmallInfo';
import { SaverPosition } from 'views/Earn/types';
import { useEarnCalculations } from 'views/Earn/useEarnCalculations';

type Props = {
  position: SaverPosition;
  withdraw: (asset: Asset) => void;
  deposit: (asset: Asset) => void;
};

export const EarnPosition = ({ position, withdraw, deposit }: Props) => {
  const { networkFee } = useEarnCalculations({
    asset: position.asset,
    amount: position.amount,
    isDeposit: false,
  });

  const positionTooSmall = networkFee.gte(position?.amount);

  const infoFields: InfoRowConfig[] = [
    {
      label: 'Amount Deposited',
      value: `${position.depositAmount.toSignificantWithMaxDecimals(6)} ${position.asset.symbol}`,
    },
    {
      label: 'Amount Redeemable',
      value: !positionTooSmall ? (
        `${position?.amount?.toSignificantWithMaxDecimals(6)} ${position.asset.symbol}`
      ) : (
        <PositionTooSmallInfo />
      ),
    },
    {
      label: 'Total Earned',
      value:
        position?.earnedAmount && !positionTooSmall ? (
          `${position?.earnedAmount?.toSignificantWithMaxDecimals(6)} ${position.asset.symbol}`
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
              <Typography>
                {position.amount?.toSignificantWithMaxDecimals(6) || 'n/a'} {position.asset.name}
              </Typography>
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
