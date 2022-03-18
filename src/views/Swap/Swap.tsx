import { useCallback, useMemo, useReducer } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import copy from 'copy-to-clipboard'
import { assetsFixture } from 'utils/assetsFixture'

import { AssetSelectType } from 'components/AssetSelect/types'
import { Button, Modal, Icon, Box, Typography } from 'components/Atomic'
import { ConfirmSwapItem } from 'components/ConfirmSwapItem'
import { Input } from 'components/Input'
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
    address: '',
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
  const handleSwap = () => {
    addFrequent(firstAsset.asset.toString())
    addFrequent(secondAsset.asset.toString())

    // TODO:
    dispatch({ type: 'setIsOpened', payload: true })
  }

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

  const handleCopyAddress = useCallback(() => {
    copy(address)

    // TODO: show notification
  }, [address])

  return (
    <PanelView
      title="Swap"
      header={
        <ViewHeader
          title={t('common.swap')}
          actionsComponent={
            <Box row className="space-x-4">
              <Icon color="secondary" name="chart" className="ml-auto" />
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

      <Box
        col
        className="p-4 md:px-8 self-stretch !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl"
      >
        <Box justify="between">
          <Typography variant="subtitle1">
            {t('common.recipientAddress')}
          </Typography>

          <Box row className="gap-x-3">
            <Icon
              onClick={handleAddressDisabledToggle}
              color="secondary"
              name={addressDisabled ? 'lock' : 'edit'}
              size={18}
            />
            <Icon
              onClick={handleCopyAddress}
              color="secondary"
              name="copy"
              size={18}
            />
            <Icon onClick={() => {}} color="secondary" name="share" size={18} />
          </Box>
        </Box>

        <Input
          disabled={addressDisabled}
          placeholder={`${t('common.recipientAddress')} ${t('common.here')}`}
          border="bottom"
          value={address}
        />
      </Box>

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
        <Button stretch size="lg" onClick={handleSwap}>
          {t('common.connectWallet')}
        </Button>

        {isOpened && (
          <Modal
            title="Confirm Swap"
            isOpened={isOpened}
            onClose={() => dispatch({ type: 'setIsOpened', payload: false })}
          >
            <ConfirmSwapItem />
          </Modal>
        )}
      </Box>
    </PanelView>
  )
}

export default Swap
