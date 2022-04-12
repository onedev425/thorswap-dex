import { useMemo } from 'react'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { assetFilterTypes } from 'components/AssetSelect/assetTypes'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect'
import { Box, Icon, Typography } from 'components/Atomic'
import { genericBgClasses, styledScrollbarClass } from 'components/constants'
import { FeaturedAssetIcon } from 'components/FeaturedAssetIcon/FeaturedAssetIcon'
import { Input } from 'components/Input'
import { TabsSelect } from 'components/TabsSelect'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

export const AssetSelectList = (props: AssetSelectProps) => {
  const { wallet } = useWallet()
  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])
  const {
    filteredAssets,
    search,
    setSearch,
    select,
    typeFilter,
    setTypeFilterOption,
  } = useAssetSelect(props)

  return (
    <div
      className={classNames(
        'flex flex-col flex-1 pb-8 lg:pb-10 rounded-box-lg',
        genericBgClasses.secondary,
      )}
    >
      <Box
        className={classNames(
          'flex px-4 py-6 pb-3 lg:p-10 lg:pb-6 flex-col rounded-t-box-lg gap-2',
          genericBgClasses.secondary,
        )}
      >
        <Input
          placeholder={t('components.assetSelect.searchTokenName')}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          stretch
          autoFocus
          className="!text-md p-1.5 flex-1 border"
          containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
          border="rounded"
          suffix={
            search ? (
              <Icon
                name="close"
                color="secondary"
                onClick={() => setSearch('')}
              />
            ) : (
              ''
            )
          }
        />

        <TabsSelect
          tabs={assetFilterTypes}
          value={typeFilter}
          onChange={setTypeFilterOption}
        />
      </Box>

      <div
        className={classNames(
          'h-full overflow-y-auto pt-3 lg:pt-6 bg-light-bg-secondary dark:bg-dark-asset-select',
          styledScrollbarClass,
          'scrollbar-track-light-bg-secondary dark:scrollbar-track-dark-asset-select',
        )}
      >
        <Box className="flex-1" col>
          {filteredAssets.map((filteredItem) => (
            <Box
              className="gap-3 px-6 py-2 cursor-pointer dark:hover:bg-dark-bg-secondary hover:bg-light-gray-light"
              key={`${filteredItem.asset.symbol}${filteredItem.asset.type}`}
              alignCenter
              onClick={() => select(filteredItem.asset)}
            >
              <FeaturedAssetIcon assetString={filteredItem.asset.toString()} />
              <AssetIcon
                size={32}
                asset={filteredItem.asset}
                hasChainIcon={filteredItem.asset.isSynth}
              />
              <Box className="flex-1" col>
                <Typography fontWeight="medium" variant="h5">
                  {filteredItem.asset.ticker}
                </Typography>
                <Typography
                  variant="caption-xs"
                  fontWeight="light"
                  color={
                    filteredItem.asset.isSynth ? 'primaryBtn' : 'secondary'
                  }
                  transform="uppercase"
                >
                  {filteredItem.asset.type}
                </Typography>
              </Box>
              <Typography color="secondary">
                {filteredItem.balance
                  ? filteredItem.balance.toSignificant(6)
                  : isConnected
                  ? '0'
                  : ''}
              </Typography>
            </Box>
          ))}

          {!filteredAssets.length && (
            <Box justifyCenter>
              <Typography>
                {t('components.assetSelect.noResultsFound')}
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  )
}
