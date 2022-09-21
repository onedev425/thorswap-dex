import { Asset, Percent, Price, QuoteMode, QuoteRoute } from '@thorswap-lib/multichain-core';
import { Box, Collapse } from 'components/Atomic';
import { memo, useCallback } from 'react';

import { SelectedRoute } from './SelectedRoute';
import { SwapRoute } from './SwapRoute';

type Props = {
  routes: (QuoteRoute & { approved?: boolean })[];
  outputAsset: Asset;
  setSwapRoute: (route: QuoteRoute) => void;
  selectedRoute?: QuoteRoute;
  outputUSDPrice: Price;
  slippage: Percent;
  inputAsset: Asset;
  quoteMode: QuoteMode;
};

export const SwapRouter = memo(
  ({
    setSwapRoute,
    selectedRoute,
    outputUSDPrice,
    outputAsset,
    routes,
    inputAsset,
    slippage,
    quoteMode,
  }: Props) => {
    const getQuoteDiff = useCallback(
      (expectedQuote: string) => {
        const expectedQuoteNumber = parseFloat(expectedQuote);
        const selectedQuoteNumber = parseFloat(selectedRoute?.expectedOutput || '0');
        if (Number.isNaN(expectedQuoteNumber) || Number.isNaN(selectedQuoteNumber)) {
          return 0;
        }

        return (1 - expectedQuoteNumber / selectedQuoteNumber) * -100;
      },
      [selectedRoute?.expectedOutput],
    );

    return (
      <Box className="self-stretch transition-max-height duration-300">
        {selectedRoute && (
          <Collapse
            className="flex-1 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col overflow-hidden"
            shadow={false}
            title={
              <SelectedRoute
                {...selectedRoute}
                assetTicker={outputAsset.ticker}
                inputAsset={inputAsset}
                outputAssetDecimal={outputAsset.decimal}
                quoteMode={quoteMode}
                slippage={slippage}
                unitPrice={outputUSDPrice.unitPrice}
              />
            }
            titleClassName="!pl-0 pr-1 !pt-0"
          >
            <Box col className="gap-1 pt-2">
              {routes.map((route) => (
                <SwapRoute
                  {...route}
                  inputAsset={inputAsset}
                  key={`${route.path}-${route.providers.join(',')}`}
                  onClick={() => setSwapRoute(route)}
                  outputAsset={outputAsset}
                  quoteMode={route.meta.quoteMode as QuoteMode}
                  selected={route === selectedRoute}
                  selectedQuoteDiff={getQuoteDiff(route.expectedOutput)}
                  unitPrice={outputUSDPrice.unitPrice}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  },
);
