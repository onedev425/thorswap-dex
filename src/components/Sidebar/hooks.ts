import { hasConnectedWallet } from '@thorswap-lib/multichain-core';
import { IconName } from 'components/Atomic';
import { SidebarItemProps } from 'components/Sidebar/types';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { IS_PROD } from 'settings/config';
import { ROUTES, THORYIELD_STATS_ROUTE } from 'settings/constants';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { useVesting } from 'views/Vesting/hooks';

export const useSidebarOptions = () => {
  const { hasVestingAlloc } = useVesting();
  const { wallet } = useWallet();
  const { multisigVisible } = useApp();

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

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

  const thorMenu: SidebarItemProps = useMemo(() => {
    const vestingItems: SidebarItemProps[] =
      isConnected && hasVestingAlloc
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
  }, [isConnected, hasVestingAlloc]);

  const sidebarOptions = useMemo(() => {
    const menu: SidebarItemProps[] = [
      {
        hasBackground: true,
        children: [
          {
            iconName: 'swap',
            href: ROUTES.Swap,
            label: t('components.sidebar.swap'),
          },
          {
            iconName: 'piggyBank' as IconName,
            href: ROUTES.Savings,
            label: 'Earn',
          },
        ],
      },
      {
        iconName: 'tradeLightning',
        label: t('components.sidebar.pool'),
        children: [
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
        // @ts-expect-error
        children: [
          {
            iconName: 'wallet',
            href: ROUTES.Wallet,
            label: t('components.sidebar.wallet'),
          },
          {
            iconName: 'send',
            href: ROUTES.Send,
            label: t('components.sidebar.send'),
          },
          {
            transform: 'none',
            iconName: 'thor',
            href: ROUTES.Thorname,
            label: 'THORName',
          },
        ].concat(
          IS_PROD
            ? []
            : [
                {
                  iconName: 'dollarOutlined' as IconName,
                  href: ROUTES.OnRamp,
                  label: 'OnRamp',
                  // @ts-expect-error
                  beta: true,
                },
              ],
        ),
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
            navLabel: 'THORYield',
            iconName: 'thoryield',
            rightIconName: 'external',
            href: THORYIELD_STATS_ROUTE,
          },
          {
            iconName: 'cloud',
            href: ROUTES.Nodes,
            transform: 'none',
            label: 'THORNode',
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
