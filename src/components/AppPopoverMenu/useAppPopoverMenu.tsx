import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import type { MenuItemType } from 'components/AppPopoverMenu/types';
import { AssetIcon } from 'components/AssetIcon';
import type { IconName } from 'components/Atomic';
import { useTheme } from 'components/Theme/ThemeContext';
import { USDAsset } from 'helpers/assets';
import { useMemo, useState } from 'react';
import { changeAppLanguage, FLAG_ICONS, LANGUAGE_NAMES, t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useApp } from 'store/app/hooks';
import type { SupportedLanguages } from 'types/app';
import { SUPPORTED_LANGUAGES, ThemeType, ThousandSeparator } from 'types/app';

type MenuType =
  | 'main'
  | 'language'
  | 'currency'
  | 'theme'
  | 'thousandSeparator'
  | 'proMode'
  | 'settings';

const separatorIcons: Record<ThousandSeparator, IconName> = {
  [ThousandSeparator.Space]: 'spaceBar',
  [ThousandSeparator.Comma]: 'comma',
  [ThousandSeparator.None]: 'blocked',
};

export const useAppPopoverMenu = () => {
  const [menuType, setMenuType] = useState<MenuType>('main');

  const onBack = () => setMenuType('main');

  const menus = {
    language: {
      title: t('appMenu.language'),
      items: useLanguageMenu(onBack),
    },
    currency: {
      title: t('appMenu.currency'),
      items: useCurrencyMenu(onBack),
    },
    main: {
      title: t('common.globalSettings'),
      items: useMainMenu(setMenuType),
    },
    theme: {
      title: t('appMenu.theme'),
      items: useThemeMenu(onBack),
    },
    thousandSeparator: {
      title: t('appMenu.thousandSeparator'),
      items: useThousandSeparatorMenu(onBack),
    },
    proMode: {
      title: t('appMenu.proModeSettings'),
      items: useProModeSettings(),
    },
    settings: {
      title: t('appMenu.customize'),
      items: useCompositionSettingsMenu(),
    },
  };

  return {
    menus,
    menuType,
    onBack,
  };
};

const useMainMenu = (setMenuType: (val: MenuType) => void) => {
  const { isLight } = useTheme();
  const { themeType, thousandSeparator, language, baseCurrency } = useApp();

  const currencyAsset = useMemo(() => {
    if (baseCurrency.includes('USD')) return USDAsset;
    if (baseCurrency.includes(Chain.Bitcoin)) return getSignatureAssetFor(Chain.Bitcoin);
    if (baseCurrency.includes(Chain.Ethereum)) return getSignatureAssetFor(Chain.Ethereum);

    return getSignatureAssetFor(Chain.THORChain);
  }, [baseCurrency]);

  const mainMenu: MenuItemType[] = [
    {
      label: getThemeLabel(themeType),
      desc: t('appMenu.themeDesc'),
      icon: isLight ? 'sun' : 'moon',
      onClick: () => setMenuType('theme'),
    },
    IS_LEDGER_LIVE
      ? undefined
      : {
          label: LANGUAGE_NAMES[language],
          desc: t('appMenu.languageDesc'),
          onClick: () => setMenuType('language'),
          icon: 'languageLetters',
          hasSubmenu: true,
          value: language,
        },
    {
      label: getSeparatorLabel(thousandSeparator),
      desc: t('appMenu.separatorDesc'),
      onClick: () => setMenuType('thousandSeparator'),
      icon: separatorIcons[thousandSeparator],
      hasSubmenu: true,
      value: thousandSeparator,
    },
    IS_LEDGER_LIVE
      ? undefined
      : {
          label: currencyAsset?.ticker || t('appMenu.currency'),
          desc: t('appMenu.currencyDesc'),
          onClick: () => setMenuType('currency'),
          icon: 'dollarOutlined',
          iconComponent:
            !currencyAsset || currencyAsset?.name === 'USD' ? null : (
              <AssetIcon asset={currencyAsset} size={25} />
            ),
          hasSubmenu: true,
          value: baseCurrency,
        },
    IS_LEDGER_LIVE
      ? undefined
      : {
          label: t('appMenu.proMode'),
          desc: t('appMenu.proModeSettings'),
          onClick: () => setMenuType('proMode'),
          icon: 'rocket',
        },
    IS_LEDGER_LIVE
      ? undefined
      : {
          label: t('appMenu.settings'),
          desc: t('appMenu.customize'),
          onClick: () => setMenuType('settings'),
          icon: 'settings',
        },
  ].filter((i) => !!i) as MenuItemType[];

  return mainMenu;
};

const useLanguageMenu = (onBack: () => void) => {
  const { language, setLanguage } = useApp();
  const onLanguageClick = (val: SupportedLanguages) => {
    onBack();
    setLanguage(val);
    changeAppLanguage(val);
  };

  const isLanguageSelected = (val: SupportedLanguages) => val === language;

  const languageMenu: MenuItemType[] = SUPPORTED_LANGUAGES.map((lang) => ({
    label: LANGUAGE_NAMES[lang],
    icon: FLAG_ICONS[lang] as IconName,
    onClick: () => onLanguageClick(lang),
    isSelected: isLanguageSelected(lang),
    gap: 'gap-1',
  }));

  return languageMenu;
};

const useCurrencyMenu = (onBack: () => void) => {
  const { baseCurrency, setBaseCurrency } = useApp();
  const onCurrencyClick = (val: AssetEntity) => {
    onBack();
    setBaseCurrency(val);
  };
  const isCurrencySelected = (val: AssetEntity) => val.toString() === baseCurrency;

  const currencyMenu: MenuItemType[] = [
    {
      label: 'USD',
      icon: 'currencyDollar',
      onClick: () => onCurrencyClick(USDAsset),
      isSelected: isCurrencySelected(USDAsset),
    },
    {
      label: 'RUNE',
      icon: 'thor',
      onClick: () => onCurrencyClick(getSignatureAssetFor(Chain.THORChain)),
      isSelected: isCurrencySelected(getSignatureAssetFor(Chain.THORChain)),
    },
    {
      label: 'BTC',
      icon: 'btc',
      onClick: () => onCurrencyClick(getSignatureAssetFor(Chain.Bitcoin)),
      isSelected: isCurrencySelected(getSignatureAssetFor(Chain.Bitcoin)),
    },
    {
      label: 'ETH',
      icon: 'eth',
      onClick: () => onCurrencyClick(getSignatureAssetFor(Chain.Ethereum)),
      isSelected: isCurrencySelected(getSignatureAssetFor(Chain.Ethereum)),
    },
  ];

  return currencyMenu;
};

const useThemeMenu = (onBack: () => void) => {
  const { themeType, setTheme } = useApp();
  const onThemeClick = (val: ThemeType) => {
    onBack();
    setTheme(val);
  };

  const isThemeSelected = (val: ThemeType) => val === themeType;

  const menu: MenuItemType[] = [
    {
      icon: 'sun',
      label: t('appMenu.lightTheme'),
      onClick: () => onThemeClick(ThemeType.Light),
      isSelected: isThemeSelected(ThemeType.Light),
    },
    {
      icon: 'moon',
      label: t('appMenu.darkTheme'),
      onClick: () => onThemeClick(ThemeType.Dark),
      isSelected: isThemeSelected(ThemeType.Dark),
    },
  ];

  return menu;
};

const useThousandSeparatorMenu = (onBack: () => void) => {
  const { thousandSeparator, setThousandSeparator } = useApp();
  const onClick = (val: ThousandSeparator) => {
    onBack();
    setThousandSeparator(val);
  };

  const isThemeSelected = (val: ThousandSeparator) => val === thousandSeparator;

  const menu: MenuItemType[] = [
    {
      icon: 'spaceBar',
      label: t('appMenu.separatorSpace'),
      onClick: () => onClick(ThousandSeparator.Space),
      isSelected: isThemeSelected(ThousandSeparator.Space),
    },
    {
      icon: 'comma',
      label: t('appMenu.separatorComma'),
      onClick: () => onClick(ThousandSeparator.Comma),
      isSelected: isThemeSelected(ThousandSeparator.Comma),
    },
    {
      icon: 'blocked',
      label: t('appMenu.separatorNone'),
      onClick: () => onClick(ThousandSeparator.None),
      isSelected: isThemeSelected(ThousandSeparator.None),
    },
  ];

  return menu;
};

const useProModeSettings = () => {
  const {
    setMultisigShowStatus,
    multisigVisible,
    customSendVisible,
    setCustomSendShowStatus,
    customDerivationVisible,
    setCustomDerivationShowStatus,
  } = useApp();
  const menu: MenuItemType[] = [
    {
      label: t('appMenu.showMultisig'),
      status: multisigVisible,
      onClick: () => setMultisigShowStatus(!multisigVisible),
    },
    {
      label: t('appMenu.showCustomSend'),
      status: customSendVisible,
      onClick: () => setCustomSendShowStatus(!customSendVisible),
    },
    {
      label: t('appMenu.showCustomDerivation'),
      status: customDerivationVisible,
      onClick: () => setCustomDerivationShowStatus(!customDerivationVisible),
    },
  ];

  return menu;
};

const useCompositionSettingsMenu = () => {
  const { setStatsShowStatus, hideStats, setChartsShowStatus, hideCharts } = useApp();

  const menu: MenuItemType[] = [
    {
      label: t('appMenu.showStats'),
      status: !hideStats,
      onClick: () => setStatsShowStatus(!hideStats),
    },
    {
      label: t('appMenu.showCharts'),
      status: !hideCharts,
      onClick: () => setChartsShowStatus(!hideCharts),
    },
  ];

  return menu;
};

const getThemeLabel = (val: ThemeType) => {
  switch (val) {
    case ThemeType.Dark:
      return t('appMenu.darkTheme');
    case ThemeType.Light:
      return t('appMenu.lightTheme');
    default:
      return t('appMenu.theme');
  }
};

const getSeparatorLabel = (val: ThousandSeparator) => {
  switch (val) {
    case ThousandSeparator.Space:
      return `${t('appMenu.separatorSpace')} (1 000)`;
    case ThousandSeparator.Comma:
      return `${t('appMenu.separatorComma')} (1,000)`;
    case ThousandSeparator.None:
      return `${t('appMenu.separatorNone')} (1000)`;
    default:
      return t('appMenu.separatorComma');
  }
};
