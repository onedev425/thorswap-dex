import { AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { Box, Collapse } from 'components/Atomic';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { memo } from 'react';

import { SelectedRoute } from './SelectedRoute';
import { SwapRoute } from './SwapRoute';

type Props = {
  routes: RouteWithApproveType[];
  outputAsset: Asset;
  setSwapRoute: (route: RouteWithApproveType) => void;
  selectedRoute?: RouteWithApproveType;
  outputUSDPrice: Price;
};

export const SwapRouter = memo(
  ({ setSwapRoute, selectedRoute, outputUSDPrice, outputAsset, routes }: Props) => (
    <Box className="self-stretch transition-max-height duration-300">
      {selectedRoute && (
        <Collapse
          className="flex-1 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col overflow-hidden"
          shadow={false}
          title={
            <SelectedRoute
              {...selectedRoute}
              assetTicker={outputAsset.ticker}
              outputAssetDecimal={outputAsset.decimal}
              unitPrice={outputUSDPrice.unitPrice}
            />
          }
          titleClassName="!pl-0 pr-1 !pt-0"
        >
          <Box col className="gap-1 pt-2">
            {routes.map((route) => (
              <SwapRoute
                {...route}
                key={`${route.path}-${route.providers.join(',')}`}
                onClick={() => setSwapRoute(route)}
                outputAsset={outputAsset}
                selected={route === selectedRoute}
                unitPrice={outputUSDPrice.unitPrice}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  ),
);
