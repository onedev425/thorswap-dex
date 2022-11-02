import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Typography, useCollapse } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { t } from 'services/i18n';
import { SaverPosition } from 'views/Savings/types';

type Props = {
  position: SaverPosition;
  withdraw: (asset: Asset) => void;
  deposit: (asset: Asset) => void;
};

export const SavingsPosition = ({ position, withdraw, deposit }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();

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

            <Typography>
              {position.amount.toSignificant(6)} {position.asset.name}
            </Typography>
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
              onClick={() => deposit(position.asset)}
              variant="primary"
            >
              {t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => withdraw(position.asset)}
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
