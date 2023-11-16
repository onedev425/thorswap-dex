import { SwapKitNumber } from '@swapkit/core';

export const getAmountFromString = (value: string, decimal: number): SwapKitNumber | null => {
  const trim = value.replace(/[, ]+/g, '').trim();

  if (trim !== '' && trim[trim.length - 1] === '.' && trim.split('.').length <= 2) {
    return null;
  }

  if (trim !== '' && trim[trim.length - 1] === '0' && trim.includes('.')) {
    return null;
  }

  return new SwapKitNumber({ value: isNaN(Number(trim)) ? 0 : trim, decimal });
};
