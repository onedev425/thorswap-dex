import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { ChartPreview } from 'components/ChartPreview/ChartPreview';
import { memo } from 'react';
import { ViewMode } from 'types/app';
import { useChartData } from 'views/Wallet/hooks';

type Props = {
  asset: AssetEntity;
  mode: ViewMode;
  sparkline?: string;
};

export const AssetChart = memo(({ asset, mode, sparkline }: Props) => {
  const { label, values } = useChartData(asset, sparkline);

  return (
    <Box
      center
      className={classNames('opacity-0 w-[99%] transition-opacity duration-500', {
        '!opacity-100': values.length > 0,
        '!-my-[20px] lg:w-[100px] xl:w-[320px]': mode === ViewMode.LIST,
      })}
      style={{ height: mode === ViewMode.CARD ? 100 : 80 }}
    >
      {values.length > 0 && <ChartPreview hideLabel labels={[label]} values={values} />}
    </Box>
  );
});
