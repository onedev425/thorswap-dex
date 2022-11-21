import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Tooltip, Typography, useCollapse } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { HighlightCard } from 'components/HighlightCard';
import { t } from 'services/i18n';
import { SaverPosition } from 'views/Earn/types';
import { useEarnCalculations } from 'views/Earn/useEarnCalculations';

type Props = {
  position: SaverPosition;
  withdraw: (asset: Asset) => void;
  deposit: (asset: Asset) => void;
};

export const EarnPosition = ({ position, withdraw, deposit }: Props) => {
  const { collapse, isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const { expectedOutputAmount, networkFee } = useEarnCalculations({
    asset: position.asset,
    amount: position.amount,
    isDeposit: false,
  });

  const positionTooSmall = networkFee.gte(position?.amount);

  return (
    <Box col justifyCenter className="self-stretch" key={position.asset.toString()}>
      <HighlightCard className="!rounded-2xl p-2 !gap-0" type="primary">
        <Box alignCenter className="cursor-pointer" justify="between" onClick={toggle}>
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
                {expectedOutputAmount?.toSignificant(6) || 'n/a'} {position.asset.name}
              </Typography>
            ) : (
              <Box className="gap-1 mr-1">
                <Typography variant="caption">n/a</Typography>
                <Tooltip content={t('views.savings.positionTooSmall')}>
                  <Icon
                    className={baseTextHoverClass}
                    color="secondary"
                    name="infoCircle"
                    size={20}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>

          <Icon
            className={classNames('transform duration-300 ease', {
              '-rotate-180': isActive,
            })}
            color="secondary"
            name="chevronDown"
          />
        </Box>

        <div
          className="overflow-hidden ease-in-out transition-all"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <Box justifyCenter className="space-x-6 md:pr-0 mt-3">
            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => {
                deposit(position.asset);
                collapse();
              }}
              variant="primary"
            >
              {t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => {
                withdraw(position.asset);
                collapse();
              }}
              variant="secondary"
            >
              {t('common.withdraw')}
            </Button>
          </Box>
        </div>
      </HighlightCard>
    </Box>
  );
};
