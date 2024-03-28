import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import type { AssetSelectProps } from 'components/AssetSelect/types';
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect';
import { Box, Icon, Switch } from 'components/Atomic';
import { genericBgClasses, styledScrollbarClass } from 'components/constants';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useGetProvidersQuery } from 'store/thorswap/api';
import { DISABLED_TOKENLIST_PROVIDERS } from 'views/Swap/hooks/useTokenList';

const PROD_DISABLED_PROVIDERS = ['Stargatearb'];

export const TokenListProviderSelect = ({ onSelect, onClose, assets }: AssetSelectProps) => {
  const { data, isLoading } = useGetProvidersQuery();

  const { toggleTokenList, disabledTokenLists } = useAssetSelect({
    onSelect,
    onClose,
    assets,
  });

  const sortedProviders = useMemo(() => {
    const providers =
      data?.filter(
        ({ provider }) =>
          !provider.toLowerCase().includes('whitelist') &&
          !PROD_DISABLED_PROVIDERS.includes(provider),
      ) || [];

    return providers
      .concat()
      .sort((a, b) => {
        const aDisabled = disabledTokenLists.includes(a.provider);
        const bDisabled = disabledTokenLists.includes(b.provider);

        return aDisabled === bDisabled ? b.nbTokens - a.nbTokens : aDisabled ? 1 : -1;
      })
      .filter(({ provider }) => !DISABLED_TOKENLIST_PROVIDERS.includes(provider));
  }, [data, disabledTokenLists]);

  return (
    <div
      className={classNames(
        'flex flex-col flex-1 rounded-box-lg pb-10 pt-10',
        genericBgClasses.secondary,
      )}
    >
      <div
        className={classNames(
          'h-full overflow-y-auto bg-light-gray-light dark:bg-dark-asset-select bg-opacity-70 dark:bg-opacity-100',
          styledScrollbarClass,
          'scrollbar-track-light-gray-light dark:scrollbar-track-dark-asset-select',
          'border-solid border-b border-t border-l-0 border-r-0 border-light-border-primary dark:border-dark-gray-light',
        )}
      >
        <Box col className="flex-1 pt-2">
          {sortedProviders.map(({ provider, nbTokens, version }) => (
            <Box
              alignCenter
              className="gap-3 px-6 py-2 cursor-pointer dark:hover:bg-dark-border-primary hover:bg-light-bg-secondary transition"
              key={provider}
              onClick={() => toggleTokenList(provider)}
            >
              <Box col className="flex-1">
                <Text
                  className="leading-[24px]"
                  fontWeight="medium"
                  textStyle="h4"
                  textTransform="capitalize"
                >
                  {provider}
                </Text>
                <Text
                  className="leading-[14px]"
                  fontWeight="light"
                  textStyle="caption-xs"
                  textTransform="uppercase"
                  variant={provider ? 'primaryBtn' : 'secondary'}
                >
                  {nbTokens} {t('common.tokens')}{' '}
                  {version ? `| v${version.major}.${version.minor}.${version.patch}` : ''}
                </Text>
              </Box>

              <Switch
                checked={!disabledTokenLists.includes(provider)}
                onChange={() => {}}
                selectedText="ON"
                unselectedText="OFF"
              />
            </Box>
          ))}

          {!data?.length &&
            (isLoading ? (
              <Box center className="p-6">
                <Icon spin name="loader" size={24} />
              </Box>
            ) : (
              <Box justifyCenter className="pt-4">
                <Text>{t('components.assetSelect.noResultsFound')}</Text>
              </Box>
            ))}
        </Box>
      </div>
    </div>
  );
};
