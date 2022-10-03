import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';

import { assetIconMap, BepIconType, customIconMap, CustomIconType } from './iconList';
import { SecondaryIconPlacement } from './types';

const twBaseUri = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';

export const checkIfImageExists = (url: string): boolean => {
  const img = new Image();

  img.src = url;

  if (img.complete) {
    return true;
  } else {
    img.onload = () => {
      return true;
    };

    img.onerror = () => {
      return false;
    };
  }

  return false;
};

export const getAssetIconUrl = ({ ticker, symbol, chain }: Asset) => {
  if (Object.keys(customIconMap).includes(ticker)) {
    return customIconMap[ticker as CustomIconType];
  }

  if (Object.keys(customIconMap).includes(symbol)) {
    return customIconMap[symbol as CustomIconType];
  }

  if (chain === Chain.Ethereum && ticker !== Chain.Ethereum) {
    if (ticker === 'WETH') {
      return 'https://assets.coingecko.com/coins/images/2518/large/weth.png';
    }

    try {
      const assetAddress = symbol.slice(ticker.length + 1);
      return `${twBaseUri}/ethereum/assets/${assetAddress}/logo.png`;
    } catch (error) {
      return undefined;
    }
  }

  const logoSymbol = assetIconMap[ticker as BepIconType];
  if (logoSymbol) {
    return `${twBaseUri}/binance/assets/${logoSymbol}/logo.png`;
  }

  return `${twBaseUri}/binance/assets/${symbol}/logo.png`;
};

export const getSecondaryIconPlacementStyle = (placement: SecondaryIconPlacement, size: number) => {
  const offset = size * 0.3;

  switch (placement) {
    case 'tl': {
      return { top: 0, left: -offset };
    }
    case 'tr': {
      return { top: 0, right: -offset };
    }
    case 'bl': {
      return { bottom: -offset, left: -offset };
    }
    case 'br': {
      return { bottom: -offset, right: -offset };
    }
  }
};

export const rgb2hex = (r: number, g: number, b: number) =>
  `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

export const rainbowStop = (h: number) => {
  const f = (n: number, k = (n + h * 12) % 12) =>
    0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return rgb2hex(Math.floor(f(0) * 255), Math.floor(f(8) * 255), Math.floor(f(4) * 255));
};

export const getIntFromName = (str: string): number[] => {
  const inputStr = String(str).toUpperCase();

  const div = 22;

  const firstInt = (inputStr.charCodeAt(0) - 'A'.charCodeAt(0)) / div;
  const secondInt = inputStr.length > 1 ? (inputStr.charCodeAt(1) - 'A'.charCodeAt(0)) / div : 0;

  return [Number(firstInt.toFixed(2)), Number(secondInt.toFixed(2))];
};
