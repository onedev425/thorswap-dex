import { Chain, getMinAmountByChain } from '@swapkit/core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'settings/router';
import { useMultisig } from 'store/multisig/hooks';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';
import type { HandleBondAction } from 'views/Nodes/types';
import { BondActionType } from 'views/Nodes/types';

import { getBondMemo } from './utils';

export const useTxBond = () => {
  const { signers } = useTxCreate();
  const navigate = useNavigate();

  const { createDepositTx } = useMultisig();

  const handleBondAction: HandleBondAction = useCallback(
    async ({ amount, nodeAddress, type }) => {
      if ((type === BondActionType.Bond || type === BondActionType.Unbond) && !amount) {
        throw new Error('Amount not provided');
      }

      const memo = getBondMemo(type, nodeAddress, amount);

      const tx = await createDepositTx({
        memo,
        assetValue:
          type === BondActionType.Bond && amount ? amount : getMinAmountByChain(Chain.THORChain),
      });

      if (tx) {
        navigate(ROUTES.TxMultisig, {
          state: { tx, signers },
        });
      }
    },
    [createDepositTx, signers, navigate],
  );

  return handleBondAction;
};
