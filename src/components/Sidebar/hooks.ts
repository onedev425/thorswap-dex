import { hasConnectedWallet } from '@thorswap-lib/multichain-core';
import { IconName } from 'components/Atomic';
import { SidebarItemProps } from 'components/Sidebar/types';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { ROUTES, THORYIELD_STATS_ROUTE } from 'settings/constants';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { useVesting } from 'views/Vesting/hooks';

export const useSidebarOptions = () => {
  const { hasVestingAlloc } = useVesting();
  const [hasAlloc, setHasAlloc] = useState(false);
  const { wallet } = useWallet();
  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const { multisigVisible } = useApp();

  const multisigMenu: SidebarItemProps = useMemo(() => {
    return {
      iconName: 'wallet',
      label: t('appMenu.thorSafe'),
      children: [
        {
          beta: true,
          iconName: 'wallet',
          href: ROUTES.Multisig,
          label: t('appMenu.multisig'),
        },
        {
          beta: true,
          iconName: 'send',
          href: ROUTES.TxBuilder,
          label: t('appMenu.transaction'),
        },
      ],
    };
  }, []);

  useEffect(() => {
    const getAllocData = async () => {
      const hasAllocated = await hasVestingAlloc();
      setHasAlloc(hasAllocated);
    };

    getAllocData();
  }, [hasVestingAlloc]);

  const thorMenu: SidebarItemProps = useMemo(() => {
    const vestingItems: SidebarItemProps[] =
      isConnected && hasAlloc
        ? [
            {
              iconName: 'chartPieOutline',
              href: ROUTES.Vesting,
              label: t('components.sidebar.vesting'),
            },
          ]
        : [];

    return {
      iconName: 'tradeLightning',
      label: t('components.sidebar.thor'),
      children: [
        {
          iconName: 'vthor',
          href: ROUTES.Stake,
          label: t('components.sidebar.staking'),
        },
        ...vestingItems,
      ],
    };
  }, [isConnected, hasAlloc]);

  const sidebarOptions = useMemo(() => {
    const menu: SidebarItemProps[] = [
      {
        iconName: 'tradeLightning',
        label: t('components.sidebar.trade'),
        hasBackground: true,
        children: [
          {
            iconName: 'swap',
            href: ROUTES.Swap,
            label: t('components.sidebar.swap'),
          },
          {
            iconName: 'inIcon',
            href: ROUTES.AddLiquidity,
            label: t('components.sidebar.addLiquidity'),
          },
          {
            iconName: 'sputnik',
            href: ROUTES.Liquidity,
            label: t('components.sidebar.liquidity'),
          },
        ],
      },
      {
        iconName: 'wallet',
        label: t('components.sidebar.wallet'),
        children: [
          {
            iconName: 'wallet' as IconName,
            href: ROUTES.Wallet,
            label: t('components.sidebar.wallet'),
          },
          {
            iconName: 'send' as IconName,
            href: ROUTES.Send,
            label: t('components.sidebar.send'),
          },
          {
            transform: 'none',
            iconName: 'thor',
            href: ROUTES.Thorname,
            label: t('components.sidebar.thorname'),
          },
        ],
      },
      {
        iconName: 'settings',
        label: t('components.sidebar.stats'),
        children: [
          {
            iconName: 'app',
            href: ROUTES.Home,
            label: t('components.sidebar.dashboard'),
          },
          {
            transform: 'none',
            label: t('components.sidebar.stats'),
            navLabel: t('components.sidebar.thoryield'),
            iconName: 'thoryield',
            rightIconName: 'external',
            href: THORYIELD_STATS_ROUTE,
          },
          {
            iconName: 'cloud',
            href: ROUTES.Nodes,
            transform: 'none',
            label: t('components.sidebar.thornode'),
          },
        ],
      },
    ];

    if (multisigVisible) {
      menu.push({ ...multisigMenu });
    }

    return [...menu, thorMenu];
  }, [multisigVisible, multisigMenu, thorMenu]);

  return sidebarOptions;
};
