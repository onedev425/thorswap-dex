import { Chain } from "@swapkit/helpers";
import type { SidebarItemProps } from "components/Sidebar/types";
import { SidebarWidgetOption } from "components/Sidebar/types";
import { useWalletContext } from "context/wallet/WalletProvider";
import { useWallet } from "context/wallet/hooks";
import { useCallback, useEffect, useMemo } from "react";
import { contractConfig } from "services/contract";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { ROUTES, THORYIELD_STATS_ROUTE } from "settings/router";
import { useApp } from "store/app/hooks";

export const useSidebarOptions = () => {
  const { hasWallet, getWalletAddress } = useWallet();
  const { multisigVisible } = useApp();
  const [{ vthorVesting, thorVesting }, walletDispatch] = useWalletContext();
  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const hasVestingAlloc = useMemo(
    () => vthorVesting.hasAlloc || thorVesting.hasAlloc,
    [vthorVesting.hasAlloc, thorVesting.hasAlloc],
  );

  const checkAlloc = useCallback(async () => {
    if (!ethAddress) return;

    const { getWallet } = await (await import("services/swapKit")).getSwapKitClient();
    const { getProvider } = await import("@swapkit/toolbox-evm");
    const callParams = {
      callProvider: getProvider(Chain.Ethereum),
      funcParams: [ethAddress, {}],
      from: ethAddress,
      funcName: "claimableAmount",
    };

    try {
      const thorAmount = await getWallet(Chain.Ethereum)?.call({
        ...callParams,
        abi: contractConfig.vesting.abi,
        contractAddress: contractConfig.vesting.address,
      });

      const vthorAmount = await getWallet(Chain.Ethereum)?.call({
        ...callParams,
        abi: contractConfig.vthor_vesting.abi,
        contractAddress: contractConfig.vthor_vesting.address,
      });

      walletDispatch({
        type: "setVestingAlloc",
        payload: {
          hasVthorAlloc:
            (typeof vthorAmount === "bigint" && vthorAmount > 0) || vthorAmount?.toString() !== "0",
          hasThorAlloc:
            (typeof thorAmount === "bigint" && thorAmount > 0) || thorAmount?.toString() !== "0",
        },
      });
    } catch (error) {
      logException(error as Error);
    }
  }, [ethAddress, walletDispatch]);

  useEffect(() => {
    checkAlloc();
  }, [checkAlloc]);

  const multisigMenu: SidebarItemProps = useMemo(() => {
    return {
      iconName: "wallet",
      label: t("appMenu.thorSafe"),
      children: [
        {
          beta: true,
          iconName: "wallet",
          href: ROUTES.Multisig,
          label: t("appMenu.multisig"),
        },
        {
          beta: true,
          iconName: "send",
          href: ROUTES.TxBuilder,
          label: t("appMenu.transaction"),
        },
      ],
    };
  }, []);

  const thorMenu: SidebarItemProps = useMemo(() => {
    const vestingItems: SidebarItemProps[] =
      hasWallet && hasVestingAlloc
        ? [
            {
              iconName: "chartPieOutline",
              href: ROUTES.Vesting,
              label: t("components.sidebar.vesting"),
            },
          ]
        : [];

    return {
      iconName: "tradeLightning",
      label: t("components.sidebar.thor"),
      children: [
        {
          iconName: "vthor",
          href: ROUTES.Stake,
          label: t("components.sidebar.staking"),
        },
        ...vestingItems,
      ],
      widgets: [SidebarWidgetOption.ThorBurn],
    };
  }, [hasWallet, hasVestingAlloc]);

  const stickyMenu: SidebarItemProps = {
    // Leave it for key
    label: " ",
    hasBackground: true,
    children: [
      {
        iconName: "swap",
        href: ROUTES.Swap,
        label: t("components.sidebar.swap"),
      },
      {
        iconName: "piggyBank",
        href: ROUTES.Earn,
        label: t("components.sidebar.earn"),
      },
      {
        iconName: "lending",
        href: ROUTES.Lending,
        label: t("components.sidebar.borrow"),
        beta: true,
      },
    ],
  };

  const sidebarOptions = useMemo(() => {
    const walletItems: SidebarItemProps[] = [
      {
        iconName: "wallet",
        href: ROUTES.Wallet,
        label: t("components.sidebar.wallet"),
      },
      {
        iconName: "send",
        href: ROUTES.Send,
        label: t("components.sidebar.send"),
      },
      {
        transform: "none",
        iconName: "thor",
        href: ROUTES.Thorname,
        label: "THORName",
      },
    ];

    const menu: SidebarItemProps[] = [
      {
        iconName: "tradeLightning",
        label: t("components.sidebar.pool"),
        children: [
          {
            iconName: "inIcon",
            href: ROUTES.AddLiquidity,
            label: t("components.sidebar.addLiquidity"),
          },
          {
            iconName: "sputnik",
            href: ROUTES.Liquidity,
            label: t("components.sidebar.liquidity"),
          },
        ],
      },
      {
        iconName: "wallet",
        label: t("components.sidebar.wallet"),
        children: walletItems,
      },
      {
        iconName: "settings",
        label: t("components.sidebar.stats"),
        children: [
          {
            iconName: "app",
            href: ROUTES.Home,
            label: t("components.sidebar.dashboard"),
          },
          {
            transform: "none",
            label: t("components.sidebar.stats"),
            navLabel: "THORYield",
            iconName: "thoryield",
            rightIconName: "external",
            href: THORYIELD_STATS_ROUTE,
          },
          {
            iconName: "cloud",
            href: ROUTES.Nodes,
            transform: "none",
            label: "THORNode",
          },
        ],
      },
    ];

    if (multisigVisible) {
      menu.push({ ...multisigMenu });
    }

    return [...menu, thorMenu];
  }, [multisigVisible, multisigMenu, thorMenu]);

  return { sidebarOptions, stickyMenu };
};
