import type { AssetValue } from '@swapkit/core';
import { Box, Collapse } from 'components/Atomic';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { memo } from 'react';

import { SelectedRoute } from './SelectedRoute';
import { SwapRoute } from './SwapRoute';

type Props = {
  routes: RouteWithApproveType[];
  outputAsset: AssetValue;
  setSwapRoute: (route: RouteWithApproveType) => void;
  selectedRoute?: RouteWithApproveType;
  outputUnitPrice: number;
  inputUnitPrice: number;
  streamSwap?: boolean;
};

export const SwapRouter = memo(
  ({
    setSwapRoute,
    selectedRoute,
    inputUnitPrice,
    outputUnitPrice,
    outputAsset,
    routes,
    streamSwap,
  }: Props) => (
    <Box className="self-stretch transition-max-height duration-300">
      {selectedRoute && (
        <Collapse
          className="flex-1 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col overflow-hidden"
          shadow={false}
          title={
            <SelectedRoute
              {...selectedRoute}
              assetTicker={outputAsset.ticker}
              inputUnitPrice={inputUnitPrice}
              outputAssetDecimal={outputAsset.decimal || 8}
              streamSwap={streamSwap}
              unitPrice={outputUnitPrice}
            />
          }
          titleClassName="!pl-0 pr-1 !pt-0"
        >
          <Box col className="gap-1 pt-2">
            {routes.map((route) => (
              <SwapRoute
                {...route}
                inputUnitPrice={inputUnitPrice}
                key={`${route.path}-${route.providers.join(',')}`}
                onClick={() => setSwapRoute(route)}
                outputAsset={outputAsset}
                selected={route === selectedRoute}
                streamSwap={streamSwap}
                unitPrice={outputUnitPrice}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  ),
);
