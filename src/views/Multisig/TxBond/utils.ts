import type { AssetValue } from '@swapkit/core';
import { getMemoFor, MemoType } from '@swapkit/core';
import { BondActionType } from 'views/Nodes/types';

export const getBondMemo = (type: BondActionType, address: string, amount?: AssetValue) => {
  switch (type) {
    case BondActionType.Bond:
      return getMemoFor(MemoType.BOND, { address });
    case BondActionType.Unbond:
      if (!amount) {
        // Non-null assertions are forbidden
        throw new Error('Amount not provided');
      }
      return getMemoFor(MemoType.UNBOND, { address, unbondAmount: amount.getBaseValue('number') });

    case BondActionType.Leave:
      return getMemoFor(MemoType.LEAVE, { address });
    default:
      return '';
  }
};
