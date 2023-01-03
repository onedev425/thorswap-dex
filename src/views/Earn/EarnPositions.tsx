import { Flex } from '@chakra-ui/react';
import { Asset, Price } from '@thorswap-lib/multichain-core';
import { Box, Icon, Typography } from 'components/Atomic';
import { DoughnutChart } from 'components/DoughnutChart/DoughnutChart';
import { ReloadButton } from 'components/ReloadButton';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';
import { EarnPosition } from 'views/Earn/EarnPosition';
import { SaverPosition } from 'views/Earn/types';

type Props = {
  positions: SaverPosition[];
  refresh: () => void;
  withdrawAsset: (asset: Asset) => void;
  depositAsset: (asset: Asset) => void;
};

export const EarnPositions = ({ positions, refresh, withdrawAsset, depositAsset }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isWalletLoading } = useWallet();
  const { pools } = useMidgard();

  const amountUsd = useCallback(
    (position: SaverPosition) => {
      return new Price({
        baseAsset: position.asset,
        pools,
        priceAmount: position.amount,
      });
    },
    [pools],
  );

  const onReload = useCallback(() => {
    setIsLoading(true);
    refresh();
    setTimeout(() => setIsLoading(false), 500);
  }, [refresh]);

  return (
    <Box center col className="w-full">
      <Box col className="max-w-[480px] w-full gap-1">
        {!!positions.length && (
          <Box className="gap-x-2 mb-1 w-full" justify="between">
            <Box />
            <ReloadButton loading={isLoading} onLoad={onReload} size={16} />
          </Box>
        )}
        <Flex align="center" direction="column" h={280} justify="center" pt={2}>
          <Typography variant="subtitle2">Your shares</Typography>
          <DoughnutChart
            data={positions.map((position) => amountUsd(position).toFixedRaw(2))}
            labels={positions.map((position) => position.asset.name)}
          />
        </Flex>
        {positions.length ? (
          positions.map((position) => (
            <EarnPosition
              deposit={depositAsset}
              key={position.asset.toString()}
              position={position}
              withdraw={withdrawAsset}
            />
          ))
        ) : (
          <Box center className="gap-2" flex={1}>
            <Typography color="primary" variant="subtitle2">
              {isWalletLoading ? t('common.loading') : t('views.wallet.noDataToShow')}
            </Typography>
            {isWalletLoading && <Icon spin name="loader" size={32} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};
