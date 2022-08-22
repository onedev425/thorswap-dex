import { useMemo } from 'react'

import classNames from 'classnames'

import { AssetSelectProps } from 'components/AssetSelect/types'
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect'
import { Box, Icon, Switch, Typography } from 'components/Atomic'
import { genericBgClasses, styledScrollbarClass } from 'components/constants'

import { useGetProvidersQuery } from 'store/thorswap/api'

import { t } from 'services/i18n'

export const TokenListProviderSelect = ({
  onSelect,
  onClose,
  assets,
}: AssetSelectProps) => {
  const { data, isLoading } = useGetProvidersQuery()

  const { toggleTokenList, disabledTokenLists } = useAssetSelect({
    onSelect,
    onClose,
    assets,
  })

  const sortedProviders = useMemo(
    () =>
      data
        ? data.concat().sort((a, b) => {
            const aDisabled = disabledTokenLists.includes(a.provider)
            const bDisabled = disabledTokenLists.includes(b.provider)

            return aDisabled === bDisabled
              ? b.nbTokens - a.nbTokens
              : aDisabled
              ? 1
              : -1
          })
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  )

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
        <Box className="flex-1 pt-2" col>
          {sortedProviders.map(
            ({ provider, nbTokens, version: { major, minor, patch } }) => (
              <Box
                className="gap-3 px-6 py-2 cursor-pointer dark:hover:bg-dark-border-primary hover:bg-light-bg-secondary transition"
                key={provider}
                alignCenter
                onClick={() => toggleTokenList(provider)}
              >
                <Box className="flex-1" col>
                  <Typography
                    className="leading-[24px]"
                    fontWeight="medium"
                    variant="h4"
                    transform="capitalize"
                  >
                    {provider}
                  </Typography>
                  <Typography
                    className="leading-[14px]"
                    variant="caption-xs"
                    fontWeight="light"
                    color={provider ? 'primaryBtn' : 'secondary'}
                    transform="uppercase"
                  >
                    {nbTokens} {t('common.tokens')} | v{major}.{minor}.{patch}
                  </Typography>
                </Box>

                <Switch
                  onChange={() => {}}
                  selectedText="ON"
                  unselectedText="OFF"
                  checked={!disabledTokenLists.includes(provider)}
                />
              </Box>
            ),
          )}

          {!data?.length &&
            (isLoading ? (
              <Box center className="p-6">
                <Icon name="loader" size={24} spin />
              </Box>
            ) : (
              <Box justifyCenter className="pt-4">
                <Typography>
                  {t('components.assetSelect.noResultsFound')}
                </Typography>
              </Box>
            ))}
        </Box>
      </div>
    </div>
  )
}
