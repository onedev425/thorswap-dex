import { Text } from '@chakra-ui/react';
import { THORNode } from '@thorswap-lib/midgard-sdk';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { useInputAmount } from 'components/InputAmount/useInputAmount';
import { showErrorToast, showInfoToast, showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { hasConnectedWallet, hasWalletConnected } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import useWindowSize from 'hooks/useWindowSize';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'store/wallet/hooks';
import { BondActionType, NodeManagePanelProps } from 'views/Nodes/types';

import { shortenAddress } from '../../../helpers/shortenAddress';
import { t } from '../../../services/i18n';
import { useApp } from '../../../store/app/hooks';
import { useMidgard } from '../../../store/midgard/hooks';

export const useNodeDetailInfo = (nodeAddress: string | undefined) => {
  const { nodes, getNodes, nodeLoading } = useMidgard();
  const { nodeWatchList, setWatchList } = useApp();

  useEffect(() => {
    if (nodes.length === 0) {
      getNodes();
    }
  }, [getNodes, nodes.length]);

  const nodeInfo = useMemo(() => {
    if (nodeLoading) return null;
    const activeNode = nodes.find((item) => item.node_address === nodeAddress);

    return activeNode || null;
  }, [nodeAddress, nodeLoading, nodes]);

  const isFavorite = useMemo(() => {
    return nodeWatchList.includes(nodeAddress || '#');
  }, [nodeAddress, nodeWatchList]);

  const handleAddToWatchList = useCallback(
    (address: string) => {
      const isSelected = nodeWatchList.includes(address);
      if (!isSelected) {
        setWatchList([address, ...nodeWatchList]);
      } else {
        const newList = nodeWatchList.filter((addr) => addr !== address);
        setWatchList(newList);
      }
    },
    [setWatchList, nodeWatchList],
  );

  return { nodeInfo, nodeLoading, isFavorite, handleAddToWatchList };
};

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
      value: Amount.fromMidgard(nodeInfo.total_bond).toFixed(1),
    },
    {
      key: 'current_award',
      label: t('views.nodes.currentReward'),
      value: Amount.fromMidgard(nodeInfo.current_award).toFixed(1),
    },
    {
      key: 'slash_points',
      label: t('views.nodes.slashPoints'),
      value: `${nodeInfo.slash_points.toString()}`,
    },
    {
      key: 'active_block_height',
      label: t('views.nodes.activeBlock'),
      value: `${Amount.fromNormalAmount(nodeInfo.active_block_height).toFixed(1)}`,
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

  const [amount, setAmount] = useState(Amount.fromBaseAmount(0, AssetEntity.RUNE().decimal));
  const { rawValue, onChange: onAmountChange } = useInputAmount({
    amountValue: amount,
    onAmountChange: setAmount,
  });
  const { wallet, setIsConnectModalOpen } = useWallet();

  const isWalletConnected = useMemo(
    () => skipWalletCheck || hasConnectedWallet(wallet),
    [skipWalletCheck, wallet],
  );

  const thorWalletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [AssetEntity.RUNE()] }),
    [wallet],
  );

  const { getMaxBalance } = useBalance();

  const maxInputBalance: Amount = useMemo(() => getMaxBalance(AssetEntity.RUNE()), [getMaxBalance]);

  const [tab, setTab] = useState(tabs[0]);

  /**
   * 1. check thor wallet connection
   * 2. check if node address matches to wallet address
   */
  const handleComplete = useCallback(async () => {
    const { validateAddress, bond, leave, unbond } = await (
      await import('services/multichain')
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
        const txURL = await bond(address || '', amount);
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
        const txURL = await unbond(address || '', amount.assetAmount.toNumber());
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
        const txURL = await leave(address || '');
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
