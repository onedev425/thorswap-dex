import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { MenuItemType } from 'components/AppPopoverMenu/types';
import { AssetIcon } from 'components/AssetIcon';
import { IconName } from 'components/Atomic';
import { useTheme } from 'components/Theme/ThemeContext';
import { useState } from 'react';
import { changeAppLanguage, FLAG_ICONS, LANGUAGE_NAMES, t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { SUPPORTED_LANGUAGES, SupportedLanguages, ThemeType, ThousandSeparator } from 'types/app';

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
  const currencyAsset = AssetEntity.fromAssetString(baseCurrency);

  const mainMenu: MenuItemType[] = [
    {
      label: getThemeLabel(themeType),
      desc: t('appMenu.themeDesc'),
      icon: isLight ? 'sun' : 'moon',
      onClick: () => setMenuType('theme'),
    },
    {
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
    {
      label: currencyAsset?.currencySymbol() || t('appMenu.currency'),
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
    {
      label: t('appMenu.proMode'),
      desc: t('appMenu.proModeSettings'),
      onClick: () => setMenuType('proMode'),
      icon: 'rocket',
    },
    {
      label: t('appMenu.settings'),
      desc: t('appMenu.customize'),
      onClick: () => setMenuType('settings'),
      icon: 'multiSettings',
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
      onClick: () => onCurrencyClick(AssetEntity.USD()),
      isSelected: isCurrencySelected(AssetEntity.USD()),
    },
    {
      label: 'RUNE',
      icon: 'thor',
      onClick: () => onCurrencyClick(AssetEntity.RUNE()),
      isSelected: isCurrencySelected(AssetEntity.RUNE()),
    },
    {
      label: 'BTC',
      icon: 'btc',
      onClick: () => onCurrencyClick(AssetEntity.BTC()),
      isSelected: isCurrencySelected(AssetEntity.BTC()),
    },
    {
      label: 'ETH',
      icon: 'eth',
      onClick: () => onCurrencyClick(AssetEntity.ETH()),
      isSelected: isCurrencySelected(AssetEntity.ETH()),
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
    {
      icon: 'auto',
      label: t('appMenu.automaticTheme'),
      onClick: () => onThemeClick(ThemeType.Auto),
      isSelected: isThemeSelected(ThemeType.Auto),
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
  const { setMultisigShowStatus, multisigVisible, customSendVisible, setCustomSendShowStatus } =
    useApp();
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
  ];

  return menu;
};

const useCompositionSettingsMenu = () => {
  const {
    setStatsShowStatus,
    hideStats,
    setChartsShowStatus,
    hideCharts,
    setPoolsShowStatus,
    arePoolsHidden,
  } = useApp();

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
    {
      label: t('appMenu.showPools'),
      status: !arePoolsHidden,
      onClick: () => setPoolsShowStatus(!arePoolsHidden),
    },
  ];

  return menu;
};

const getThemeLabel = (val: ThemeType) => {
  switch (val) {
    case ThemeType.Auto:
      return t('appMenu.automaticTheme');
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
