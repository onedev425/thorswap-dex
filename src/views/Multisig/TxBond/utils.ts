import { Amount, Memo } from '@thorswap-lib/multichain-core';
import { BondActionType } from 'views/Nodes/types';

export const getBondMemo = (type: BondActionType, nodeAddress: string, amount?: Amount) => {
  switch (type) {
    case BondActionType.Bond:
      return Memo.bondMemo(nodeAddress);
    case BondActionType.Unbond:
      if (!amount) {
        // Non-null assertions are forbidden
        throw new Error('Amount not provided');
      }

      return Memo.unbondMemo(nodeAddress, amount.baseAmount.toNumber());

    case BondActionType.Leave:
      return Memo.leaveMemo(nodeAddress);
    default:
      return '';
  }
};
