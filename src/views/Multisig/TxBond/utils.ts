import type { Amount } from '@thorswap-lib/swapkit-core';
import { getMemoFor } from '@thorswap-lib/swapkit-core';
import { MemoType } from '@thorswap-lib/types';
import { BondActionType } from 'views/Nodes/types';

export const getBondMemo = (type: BondActionType, address: string, amount?: Amount) => {
  switch (type) {
    case BondActionType.Bond:
      return getMemoFor(MemoType.BOND, { address });
    case BondActionType.Unbond:
      if (!amount) {
        // Non-null assertions are forbidden
        throw new Error('Amount not provided');
      }
      return getMemoFor(MemoType.UNBOND, { address, unbondAmount: amount.baseAmount.toNumber() });

    case BondActionType.Leave:
      return getMemoFor(MemoType.LEAVE, { address });
    default:
      return '';
  }
};
