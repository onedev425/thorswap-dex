import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetButton } from 'components/AssetSelect/AssetButton'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect'
import { Box, Typography } from 'components/Atomic'
import { genericBgClasses, styledScrollbarClass } from 'components/constants'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

export const AssetSelectList = (props: AssetSelectProps) => {
  const { filteredAssets, search, setSearch, select } = useAssetSelect(props)

  return (
    <div
      className={classNames(
        'flex flex-col flex-1 pb-8 lg:pb-10 rounded-box-lg',
        genericBgClasses.secondary,
      )}
    >
      <div
        className={classNames(
          'flex px-4 py-6 pb-3 lg:p-10 lg:pb-6 flex-col rounded-t-box-lg',
          genericBgClasses.secondary,
        )}
      >
        <Input
          placeholder="Search name or paste address..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          stretch
          autoFocus
          className="flex-1 border"
        />

        {props.commonAssets?.length > 0 && (
          <div className="flex flex-row flex-wrap gap-2 pt-3 lg:pt-6 md:gap-5">
            {props.commonAssets.map((commonItem) => (
              <div key={commonItem.asset.symbol}>
                <AssetButton
                  className="bg-opacity-70 dark:bg-opacity-70"
                  onClick={() => select(commonItem)}
                  asset={commonItem.asset}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
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
              key={filteredItem.asset.symbol}
              alignCenter
              onClick={() => select(filteredItem)}
            >
              <AssetIcon size={28} asset={filteredItem.asset} />
              <Box className="flex-1" col>
                <Typography fontWeight="medium" variant="h5">
                  {filteredItem.asset.symbol}
                </Typography>
                <Typography
                  variant="caption-xs"
                  fontWeight="light"
                  color="secondary"
                >
                  {filteredItem.type}
                </Typography>
              </Box>
              <Typography color="secondary">{filteredItem.balance}</Typography>
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
