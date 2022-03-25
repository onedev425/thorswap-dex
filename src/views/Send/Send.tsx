import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

import { useParams, useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { assetsFixture, commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { Button, Box, Tooltip, Icon, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { SendConfirm } from 'components/Modals/SendConfirm'
import { PanelInput } from 'components/PanelInput'
import { PanelView } from 'components/PanelView'
import { SwapSettingsPopover } from 'components/SwapSettings'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { sendReducer } from './sendReducer'

const [initialAsset] = assetsFixture

const Send = () => {
  const [searchParams] = useSearchParams()
  const { assetParam } = useParams<{ assetParam: string }>()

  const [{ memo, address, asset, isOpened }, dispatch] = useReducer(
    sendReducer,
    {
      address: searchParams.get('address') || '',
      isOpened: false,
      memo: '',
      asset: {
        asset: initialAsset.asset,
        change: initialAsset.change,
        balance: initialAsset.balance,
        value: '0',
        price: '5',
      },
    },
  )

  const handleAssetChange = useCallback((payload: Asset) => {
    dispatch({ type: 'setAsset', payload })
  }, [])

  const handleValueChange = useCallback((value: string) => {
    dispatch({ type: 'setAssetValue', payload: value })
  }, [])

  const setModalVisibility = (payload: boolean) => {
    dispatch({ type: 'setIsOpened', payload })
  }

  const handleChange =
    (type: 'setAddress' | 'setMemo'): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      dispatch({ type, payload: event.target.value })
    }

  useEffect(() => {
    const getSendAsset = async () => {
      const assetObj = Asset.decodeFromURL(assetParam || '')

      if (assetObj) {
        await assetObj.setDecimal()
        handleAssetChange(assetObj)
      }
    }

    getSendAsset()
  }, [assetParam, handleAssetChange])

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: (
          <Box className="gap-2" center>
            <Typography variant="caption">0.00675 ETH ($20)</Typography>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon size={20} color="secondary" name="infoCircle" />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  )

  return (
    <PanelView
      title={t('common.send')}
      header={
        <ViewHeader
          title={t('common.send')}
          actionsComponent={<SwapSettingsPopover />}
        />
      }
    >
      <AssetInput
        selectedAsset={asset}
        assets={assetsFixture}
        commonAssets={commonAssets}
        secondary
        onAssetChange={handleAssetChange}
        onValueChange={handleValueChange}
      />

      <PanelInput
        title={t('common.recipientAddress')}
        placeholder={`${t('common.recipientAddress')} ${t('common.here')}`}
        onChange={handleChange('setAddress')}
        value={address}
      />

      <PanelInput
        collapsible
        title={t('common.memo')}
        placeholder={t('common.memo')}
        onChange={handleChange('setMemo')}
        value={memo}
      />

      <InfoTable horizontalInset items={summary} />

      <Box center className="w-full pt-5">
        <Button stretch size="lg" onClick={() => setModalVisibility(true)}>
          {t('common.send')}
        </Button>
      </Box>

      {isOpened && (
        <SendConfirm
          isOpened={isOpened}
          address={address}
          asset={asset}
          onClose={() => setModalVisibility(false)}
          onConfirm={() => {
            console.log('Swap confirmed.')
          }}
        />
      )}
    </PanelView>
  )
}
export default Send
