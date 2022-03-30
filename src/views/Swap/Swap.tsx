import { ChangeEventHandler, useCallback, useMemo, useReducer } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import copy from 'copy-to-clipboard'
import { assetsFixture } from 'utils/assetsFixture'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Icon, Box } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { ConfirmSwap } from 'components/Modals/ConfirmSwap'
import { PanelInput, PanelInputTitle } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { useAssets } from 'redux/assets/hooks'

import { t } from 'services/i18n'

import { AssetInputs } from './AssetInputs'
// import { AutoRouterInfo } from './AutoRouterInfo'
import { SwapInfo } from './SwapInfo'
import { swapReducer } from './swapReducer'

const defaultFirstAsset = {
  asset: Asset.BTC(),
  value: '4.7',
  change: '0.5',
} as AssetSelectType
const defaultSecondAsset = {
  asset: Asset.RUNE(),
  value: '0',
  change: '0.5',
} as AssetSelectType
const priceImpact = -0.06

const Swap = () => {
  const [searchParams] = useSearchParams()
  const { inputAsset, outputAsset } = useMemo(() => {
    const input = searchParams.get('input') || Asset.BTC()
    const output = searchParams.get('output') || Asset.RUNE()

    const inputParamsAsset = assetsFixture.find(
      ({ asset }) => asset.toString() === input,
    )
    const outputParamsAsset = assetsFixture.find(
      ({ asset }) => asset.toString() === output,
    )
    const firstAsset = inputParamsAsset || defaultFirstAsset
    const secondAsset =
      outputParamsAsset || firstAsset.asset === defaultSecondAsset.asset
        ? defaultFirstAsset
        : defaultSecondAsset

    return {
      inputAsset: firstAsset,
      outputAsset: secondAsset,
    }
  }, [searchParams])

  const [
    { address, addressDisabled, isOpened, firstAsset, secondAsset, slippage },
    dispatch,
  ] = useReducer(swapReducer, {
    address: 'thor123123123123',
    addressDisabled: false,
    isOpened: false,
    expertMode: false,
    autoRouter: true,
    slippage: 0.5,
    firstAsset: {
      asset: inputAsset.asset,
      change: inputAsset.change,
      value: inputAsset.value,
      price: '5',
    },
    secondAsset: {
      asset: outputAsset.asset,
      change: outputAsset.change,
      value: outputAsset.value,
      price: '10',
    },
  })

  const { addFrequent } = useAssets()

  const handleAssetChange = useCallback(
    (asset: 'first' | 'second') => (payload: Asset) => {
      const actionType = asset === 'first' ? 'setFirstAsset' : 'setSecondAsset'

      dispatch({ type: actionType, payload })
    },
    [],
  )

  const handleValueChange = useCallback(
    (asset: 'first' | 'second') => (value: string) => {
      const actionType =
        asset === 'first' ? 'setFirstAssetValue' : 'setSecondAssetValue'

      dispatch({ type: actionType, payload: value })
    },
    [],
  )

  const handleAssetsSwap = useCallback(() => {
    dispatch({ type: 'swapAssets' })
  }, [])

  const handleAddressDisabledToggle = useCallback(() => {
    dispatch({ type: 'setAddressDisabled', payload: !addressDisabled })
  }, [addressDisabled])

  const handleAddressChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      dispatch({ type: 'setAddress', payload: target.value })
    },
    [],
  )

  const handleCopyAddress = useCallback(() => {
    copy(address)

    // TODO: show notification
  }, [address])

  const handleSwap = useCallback(() => {
    addFrequent(firstAsset.asset.toString())
    addFrequent(secondAsset.asset.toString())

    dispatch({ type: 'setIsOpened', payload: true })
  }, [addFrequent, firstAsset.asset, secondAsset.asset])

  const handleConfirmSwapClose = useCallback(() => {
    dispatch({ type: 'setIsOpened', payload: false })
  }, [])

  return (
    <PanelView
      title="Swap"
      header={
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box center row className="space-x-4">
              <Icon color="secondary" name="chart" />
              <SwapSettingsPopover />
            </Box>
          }
        />
      }
    >
      <AssetInputs
        firstAsset={firstAsset}
        secondAsset={secondAsset}
        onAssetChange={handleAssetChange}
        onValueChange={handleValueChange}
        onAssetsSwap={handleAssetsSwap}
      />

      <PanelInput
        placeholder={`${t('common.recipientAddress')} ${t('common.here')}`}
        stretch
        disabled={addressDisabled}
        onChange={handleAddressChange}
        value={address}
        titleComponent={
          <Box flex={1} alignCenter justify="between">
            <PanelInputTitle> {t('common.recipientAddress')}</PanelInputTitle>

            <Box row>
              <Box className={baseHoverClass}>
                <Icon
                  color="secondary"
                  name={addressDisabled ? 'lock' : 'edit'}
                  size={16}
                  onClick={handleAddressDisabledToggle}
                />
              </Box>
              <Box className={baseHoverClass}>
                <Icon
                  color="secondary"
                  name="copy"
                  size={16}
                  onClick={handleCopyAddress}
                />
              </Box>
              <Box className={baseHoverClass}>
                <Icon
                  color="secondary"
                  name="share"
                  size={16}
                  onClick={() => {}}
                />
              </Box>
            </Box>
          </Box>
        }
      />

      <SwapInfo
        firstAsset={firstAsset}
        secondAsset={secondAsset}
        priceImpact={priceImpact}
        slippage={slippage}
      />

      {/* <AutoRouterInfo
          firstAsset={firstAsset.asset}
          secondAsset={secondAsset.asset}
        /> */}

      <Box className="w-full pt-5">
        <Button isFancy stretch size="lg" onClick={handleSwap}>
          {t('common.connectWallet')}
        </Button>

        <ConfirmSwap
          send={{ symbol: firstAsset.asset.symbol, value: firstAsset.value }}
          receive={{
            symbol: secondAsset.asset.symbol,
            value: secondAsset.value,
          }}
          fee=""
          totalFee=""
          estimatedTime="<5s"
          slippage={slippage}
          address={address}
          isOpened={isOpened}
          onClose={handleConfirmSwapClose}
        />
      </Box>
    </PanelView>
  )
}

export default Swap
