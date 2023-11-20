import { Text } from '@chakra-ui/react';
import { AssetValue, Chain, SwapKitNumber } from '@swapkit/core';
import type { THORNode } from '@thorswap-lib/midgard-sdk';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { useInputAmount } from 'components/InputAmount/useInputAmount';
import { showErrorToast, showInfoToast, showSuccessToast } from 'components/Toast';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import copy from 'copy-to-clipboard';
import { RUNEAsset } from 'helpers/assets';
import { useBalance } from 'hooks/useBalance';
import useWindowSize from 'hooks/useWindowSize';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NodeManagePanelProps } from 'views/Nodes/types';
import { BondActionType } from 'views/Nodes/types';

import { shortenAddress } from '../../../helpers/shortenAddress';
import { t } from '../../../services/i18n';

export const useNodeStats = (nodeInfo: THORNode) => {
  const { isMdActive } = useWindowSize();
  if (!nodeInfo) return [];

  return [
    {
      key: 'node_address',
      label: t('views.nodes.address'),
      value: (
        <Button
          className="!px-2 h-auto"
          onClick={(e) => {
            copy(nodeInfo.node_address);
            e.stopPropagation();
            e.preventDefault();
          }}
          rightIcon={<Icon name="copy" size={14} />}
          tooltip={t('common.copy')}
          variant="borderlessTint"
        >
          {isMdActive ? nodeInfo.node_address : shortenAddress(nodeInfo.node_address, 6, 4)}
        </Button>
      ),
    },
    {
      key: 'bond_address',
      label: t('views.nodes.bondAddress'),
      value: (
        <Button
          className="!px-2 h-auto"
          onClick={(e) => {
            copy(nodeInfo.bond_address);
            e.stopPropagation();
            e.preventDefault();
          }}
          rightIcon={<Icon name="copy" size={14} />}
          tooltip={t('common.copy')}
          variant="borderlessTint"
        >
          {isMdActive ? nodeInfo.bond_address : shortenAddress(nodeInfo.bond_address, 6, 4)}
        </Button>
      ),
    },
    {
      key: 'ip_address',
      label: t('views.nodes.IPAddress'),
      value: nodeInfo.ip_address,
    },
    {
      key: 'version',
      label: t('views.nodes.version'),
      value: nodeInfo.version,
    },
    {
      key: 'status',
      label: t('views.nodes.status'),
      value: nodeInfo.status,
    },
    {
      key: 'bond',
      label: t('views.nodes.bond'),
      value: new SwapKitNumber({ value: nodeInfo.total_bond, decimal: 8 }).toFixed(1),
    },
    {
      key: 'current_award',
      label: t('views.nodes.currentReward'),
      value: new SwapKitNumber({ value: nodeInfo.current_award, decimal: 8 }).toFixed(1),
    },
    {
      key: 'slash_points',
      label: t('views.nodes.slashPoints'),
      value: `${nodeInfo.slash_points.toString()}`,
    },
    {
      key: 'active_block_height',
      label: t('views.nodes.activeBlock'),
      value: new SwapKitNumber(nodeInfo.active_block_height).toFixed(1),
    },
    {
      key: 'requested_to_leave',
      label: t('views.nodes.requestedToLeave'),
      value: `${nodeInfo.requested_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: 'forced_to_leave',
      label: t('views.nodes.forcedToLeave'),
      value: `${nodeInfo.forced_to_leave ? 'YES' : 'NO'}`,
    },
    {
      key: 'leave_height',
      label: t('views.nodes.leaveHeight'),
      value: `${nodeInfo.leave_height.toString()}`,
    },
    {
      key: 'jail_address',
      label: t('views.nodes.jailNodeAddress'),
      value: nodeInfo.jail.node_address ? shortenAddress(nodeInfo.jail?.node_address, 6, 4) : '',
    },
  ];
};

export const useNodeManager = ({
  address,
  handleBondAction,
  skipWalletCheck,
}: NodeManagePanelProps) => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWallet, hasWallet } = useWallet();
  const [maxInputBalance, setMaxInputBalance] = useState<AssetValue>();

  const tabs = useMemo(
    () =>
      Object.values(BondActionType).map((type) => ({
        label: t(`views.nodes.${type}`),
        value: type,
      })) as { label: string; value: BondActionType }[],
    [],
  );

  const getTab = useCallback(
    (type: BondActionType) => {
      return tabs.find((t) => t.value === type);
    },
    [tabs],
  );

  const [amount, setAmount] = useState(AssetValue.fromChainOrSignature(Chain.THORChain, 0));
  const { rawValue, onChange: onAmountChange } = useInputAmount({
    amountValue: new SwapKitNumber({ value: amount.getValue('number'), decimal: amount.decimal }),
    onAmountChange: (skNumber) =>
      setAmount(AssetValue.fromChainOrSignature(Chain.THORChain, skNumber.getValue('number'))),
  });

  const isWalletConnected = useMemo(
    () => skipWalletCheck || hasWallet,
    [hasWallet, skipWalletCheck],
  );

  const thorWalletConnected = useMemo(() => getWallet(RUNEAsset.chain), [getWallet]);

  const { getMaxBalance } = useBalance();

  useEffect(() => {
    getMaxBalance(RUNEAsset).then((runeMaxBalance) => setMaxInputBalance(runeMaxBalance));
  }, [getMaxBalance]);

  const [tab, setTab] = useState(tabs[0]);

  /**
   * 1. check thor wallet connection
   * 2. check if node address matches to wallet address
   */
  const handleComplete = useCallback(async () => {
    const { validateAddress, nodeAction } = await (
      await import('services/swapKit')
    ).getSwapKitClient();

    const isValidAddress = validateAddress({
      chain: Chain.THORChain,
      address: address || '',
    });

    if (!isValidAddress) {
      return showInfoToast(
        t('views.nodes.detail.InvalidNodeAddress'),
        t('views.nodes.detail.CorrectNodeAddress'),
      );
    }

    // Custom action handler
    if (handleBondAction) {
      return handleBondAction({
        type: tab.value,
        nodeAddress: address || '',
        amount,
      });
    }

    if (!thorWalletConnected) {
      return showInfoToast(
        t('views.nodes.detail.WalletNotConnected'),
        t('views.nodes.detail.ConnectThorChainAgainPlease'),
      );
    }

    try {
      if (tab.value === BondActionType.Bond) {
        // bond action
        const txURL = await nodeAction({
          address: address || '',
          type: 'bond',
          assetValue: amount,
        });
        showSuccessToast(
          t('views.nodes.detail.ViewBondTx'),
          <Box className="align-center py-2">
            <Text fontWeight="light" textStyle="caption-xs">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Text>
            <Link className="no-underline" to={txURL}>
              <Button size="sm" variant="outlineTint">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </Box>,
        );
      } else if (tab.value === BondActionType.Unbond) {
        const txURL = await nodeAction({
          address: address || '',
          type: 'unbond',
          assetValue: amount,
        });
        showSuccessToast(
          t('views.nodes.detail.ViewUnBondTx'),
          <>
            <Text fontWeight="light" textStyle="caption-xs">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Text>
            <Link className="no-underline pt-3" to={txURL}>
              <Button size="sm" variant="outlineTint">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </>,
        );
      } else {
        const txURL = await nodeAction({ address: address || '', type: 'leave' });
        showSuccessToast(
          t('views.nodes.detail.ViewLeaveTx'),
          <>
            <Text fontWeight="light" textStyle="caption-xs">
              {t('views.nodes.detail.transactionSentSuccessfully')}
            </Text>
            <Link className="no-underline pt-3" to={txURL}>
              <Button size="sm" variant="outlineTint">
                {t('views.nodes.detail.ViewTransaction')}
              </Button>
            </Link>
          </>,
        );
      }
    } catch (error: NotWorth) {
      console.error(error);
      showErrorToast(t('views.nodes.detail.TransactionFailed'), `${error}`);
    }
  }, [amount, handleBondAction, address, tab.value, thorWalletConnected]);

  const onTabChange = useCallback(
    (v: string) => setTab(getTab(v as BondActionType) || tabs[0]),
    [getTab, tabs],
  );

  return {
    tabs,
    activeTab: tab,
    handleComplete,
    rawAmount: rawValue,
    onAmountChange,
    onTabChange,
    isWalletConnected,
    setIsConnectModalOpen,
    maxInputBalance,
  };
};
