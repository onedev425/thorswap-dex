import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { QueryStatus } from '@reduxjs/toolkit/dist/query'
import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'
import classNames from 'classnames'
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'

import { useThorchainErc20SupportedAddresses } from 'views/Swap/hooks/useThorchainErc20Supported'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Box, Icon } from 'components/Atomic'

import { useAssets } from 'store/assets/hooks'
import { useLazyGetTokenListQuery } from 'store/static/api'
import { useAppSelector } from 'store/store'
import { useGetProvidersQuery } from 'store/thorswap/api'
import { Token } from 'store/thorswap/types'

import { useAssetsWithBalanceFromTokens } from './hooks/useAssetsWithBalanceFromTokens'

type Props = {
  onSwitchPair: (unsupported?: boolean) => void
  onInputAssetChange: (asset: Asset) => void
  onOutputAssetChange: (asset: Asset) => void
  onInputAmountChange: (value: Amount) => void
  inputAsset: AssetInputType
  outputAsset: AssetInputType
}

const options: Fuse.IFuseOptions<AssetSelectType> = {
  ignoreLocation: true,
  keys: [
    { name: ['cg.id', 'cg.name', 'ticker'], weight: 2 },
    'asset.ticker',
    'asset.network',
  ],
  minMatchCharLength: 1,
  shouldSort: true,
  threshold: 0.2,
}

export const AssetInputs = memo(
  ({
    inputAsset,
    outputAsset,
    onInputAssetChange,
    onOutputAssetChange,
    onInputAmountChange,
    onSwitchPair,
  }: Props) => {
    const fuse = useRef<Fuse<AssetSelectType>>(new Fuse([], options))
    const [query, setQuery] = useState('')
    const [iconRotate, setIconRotate] = useState(false)
    const [tokens, setTokens] = useState<Token[]>([])
    const [fetchTokenList, { isFetching }] = useLazyGetTokenListQuery()
    const disabledProviders = useAppSelector(
      ({ assets: { disabledTokenLists } }) => disabledTokenLists,
    )

    const thorchainERC20SupportedAddresses =
      useThorchainErc20SupportedAddresses()
    const { data: providersData } = useGetProvidersQuery()
    const { isFeatured, isFrequent } = useAssets()

    const providers = useMemo(() => {
      if (!providersData) return []

      return providersData
        .map(({ provider }) => provider)
        .filter((p) => !disabledProviders.includes(p))
    }, [disabledProviders, providersData])

    const handleAssetSwap = useCallback(() => {
      const unsupportedOutputAfterChange =
        outputAsset.asset.L1Chain !== Chain.Ethereum &&
        !thorchainERC20SupportedAddresses.includes(
          inputAsset.asset.symbol.split('-')[1]?.toLowerCase(),
        )

      onSwitchPair(unsupportedOutputAfterChange)
      setIconRotate((rotate) => !rotate)
    }, [
      inputAsset.asset.symbol,
      onSwitchPair,
      outputAsset.asset.L1Chain,
      thorchainERC20SupportedAddresses,
    ])

    const fetchTokens = useCallback(async () => {
      if (!providers.length) return

      const providerRequests = providers.map(async (provider) =>
        fetchTokenList(provider),
      )

      const providersData = await Promise.all(providerRequests)
      const tokens = providersData.reduce((acc, { data, status }) => {
        if (!data?.tokens) return acc

        return status === QueryStatus.rejected ? acc : [...acc, ...data.tokens]
      }, [] as Token[])

      setTokens(tokens)
    }, [fetchTokenList, providers])

    useEffect(() => {
      fetchTokens()
    }, [fetchTokens])

    const assetList = useAssetsWithBalanceFromTokens(tokens)

    useEffect(() => {
      fuse.current = new Fuse<AssetSelectType>(assetList, options)
    }, [assetList])

    const assets = useMemo(() => {
      const searchedAssets =
        query.length > 0
          ? fuse.current.search(query, { limit: 50 }).map(({ item }) => item)
          : assetList

      const sortedAssets = searchedAssets.concat().sort((a, b) => {
        const aFeatured = isFeatured(a)
        const aFrequent = isFrequent(a)
        const bFeatured = isFeatured(b)
        if (!a.balance && !b.balance) {
          if (aFeatured || (aFrequent && !bFeatured)) {
            return -1
          }

          return a.provider === b.provider
            ? (b?.cg?.market_cap || 0) - (a?.cg?.market_cap || 0)
            : b.provider?.toLowerCase() === 'thorchain'
            ? 1
            : -1
        }

        if (!a.balance) return 1
        if (!b.balance) return -1

        return bFeatured ? 1 : aFeatured ? -1 : b.balance.gt(a.balance) ? 1 : -1
      })

      return uniqBy(sortedAssets, ({ asset }) => asset.toString())
    }, [assetList, isFeatured, isFrequent, query])

    const assetInputProps = useMemo(
      () => ({
        isLoading: isFetching,
        query,
        setQuery,
      }),
      [isFetching, query],
    )

    const outputAssets = useMemo(() => {
      if (
        !thorchainERC20SupportedAddresses?.length ||
        inputAsset.asset.L1Chain === Chain.Ethereum
      ) {
        return assets
      }

      const thorchainSupported = assets.filter(({ asset }) =>
        asset.isETH() || asset?.L1Chain !== Chain.Ethereum
          ? true
          : thorchainERC20SupportedAddresses.includes(
              asset.symbol.split('-')[1]?.toLowerCase(),
            ),
      )

      return thorchainSupported
    }, [assets, inputAsset.asset.L1Chain, thorchainERC20SupportedAddresses])

    return (
      <div className="relative self-stretch md:w-full">
        <Box
          center
          onClick={handleAssetSwap}
          className={classNames(
            'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[18px] cursor-pointer',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent hover:brightness-125 transition',
          )}
        >
          <Icon
            size={20}
            className={classNames('p-1 transition-all', {
              '-scale-x-100': iconRotate,
            })}
            name="arrowDown"
            color="white"
          />
        </Box>

        <AssetInput
          {...assetInputProps}
          assets={assets}
          selectedAsset={inputAsset}
          className="!mb-1 flex-1"
          onAssetChange={onInputAssetChange}
          onValueChange={onInputAmountChange}
        />

        <AssetInput
          {...assetInputProps}
          assets={outputAssets}
          hideMaxButton
          onAssetChange={onOutputAssetChange}
          selectedAsset={outputAsset}
        />
      </div>
    )
  },
)
