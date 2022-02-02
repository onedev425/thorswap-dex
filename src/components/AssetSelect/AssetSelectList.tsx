import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetButton } from 'components/AssetSelect/AssetButton'
import { AssetSelectProps } from 'components/AssetSelect/types'
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect'
import { Card } from 'components/Card'
import { genericBgClasses, styledScrollbarClass } from 'components/constants'
import { Input } from 'components/Input'
import { Typography } from 'components/Typography'

export const AssetSelectList = (props: AssetSelectProps) => {
  const { filteredAssets, search, setSearch, select } = useAssetSelect(props)

  return (
    <div
      className={classNames(
        'flex flex-col flex-1 pb-10 rounded-box-lg',
        genericBgClasses.primary,
      )}
    >
      <div
        className={classNames(
          'flex p-10 pb-6 flex-col rounded-t-box-lg',
          genericBgClasses.secondary,
        )}
      >
        <Input
          icon="search"
          placeholder="Search name or paste address..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          stretch
          autoFocus
        />

        {props.commonAssets?.length > 0 && (
          <div className="flex flex-row flex-wrap pt-6 gap-2">
            {props.commonAssets.map((asset) => (
              <div key={asset.name}>
                <AssetButton
                  className="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-70 dark:bg-opacity-70"
                  onClick={() => select(asset)}
                  name={asset.name}
                  size="small"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={classNames(
          'h-full overflow-y-auto p-10 pb-0',
          styledScrollbarClass,
        )}
      >
        <div className="flex flex-col flex-1 gap-2">
          {filteredAssets.map((asset) => (
            <Card
              className="flex flex-row items-center gap-5 cursor-pointer hover:opacity-80 bg-light-gray-light dark:bg-dark-gray-light bg-opacity-70 dark:bg-opacity-70"
              onClick={() => select(asset)}
              key={asset.name}
            >
              <AssetIcon name={asset.name} />
              <div className="flex flex-col flex-1">
                <Typography>{asset.name}</Typography>
                <Typography color="secondary">{asset.type}</Typography>
              </div>
              <Typography color="secondary">{asset.balance}</Typography>
            </Card>
          ))}
          {!filteredAssets.length && (
            <div className="flex justify-center">
              <Typography>No results found</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
