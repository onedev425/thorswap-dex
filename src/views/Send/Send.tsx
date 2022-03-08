import { ChangeEventHandler, useCallback, useReducer } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { assetsFixture, commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import {
  Button,
  Modal,
  Card,
  Box,
  Typography,
  Tooltip,
  Icon,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Information } from 'components/Information'
import { Input } from 'components/Input'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { sendReducer } from './sendReducer'

const [initialAsset] = assetsFixture

const Send = () => {
  const [searchParams] = useSearchParams()
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

  return (
    <Box className="self-center w-full max-w-[600px]" col>
      <Helmet title="Send" content="Send" />

      <Box className="w-full mx-2" col>
        <ViewHeader
          title={t('common.send')}
          actionsComponent={<Icon size={26} name="cog" color="secondary" />}
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="flex-col md:w-full mt-4 md:mt-8 md:h-auto shadow-lg"
      >
        <AssetInput
          selectedAsset={asset}
          assets={assetsFixture}
          commonAssets={commonAssets}
          secondary
          onAssetChange={handleAssetChange}
          onValueChange={handleValueChange}
        />

        <div className="mt-6 mb-4">
          <Typography variant="h4">{t('common.recipient')}</Typography>
        </div>
        <Input
          border="bottom"
          className="text-lg"
          value={address}
          stretch
          placeholder={t('common.recipient')}
          onChange={handleChange('setAddress')}
        />

        <div className="mt-6 mb-4">
          <Typography variant="h4">{t('common.memo')}</Typography>
        </div>
        <Input
          border="bottom"
          className="text-lg"
          value={memo}
          stretch
          placeholder={t('common.memo')}
          onChange={handleChange('setMemo')}
        />

        <Box row flex={1} mt={3}>
          <Information
            className="flex-1"
            label="Transaction Fee"
            value="0.00675 ETH ($20)"
          />

          <Tooltip content="Transaction fee tooltip">
            <Icon
              className="ml-2 mt-2"
              size={20}
              color="secondary"
              name="infoCircle"
            />
          </Tooltip>
        </Box>

        <Box center className="pt-5 md:pt-10">
          <Button onClick={() => setModalVisibility(true)} className="px-20">
            {t('common.send')}
          </Button>
        </Box>
      </Card>

      {isOpened && (
        <Modal
          title="Confirm"
          isOpened={isOpened}
          onClose={() => setModalVisibility(false)}
        >
          <div className="my-3">
            <Box className="gap-4" col>
              <Information
                className="flex-1"
                label="Send"
                value={`${asset.value} ${asset.asset}`}
              />

              <Information
                className="flex-1"
                label="Recipient"
                value={address}
              />

              <Box row flex={1}>
                <Information
                  className="flex-1"
                  label="Transaction Fee"
                  value="0.00675 ETH ($20)"
                />

                <Tooltip content="Transaction fee tooltip">
                  <Icon
                    className="ml-2 mt-2"
                    size={20}
                    color="secondary"
                    name="infoCircle"
                  />
                </Tooltip>
              </Box>

              <Button className="px-32 mx-4 mt-8">{t('common.confirm')}</Button>
            </Box>
          </div>
        </Modal>
      )}
    </Box>
  )
}
export default Send
