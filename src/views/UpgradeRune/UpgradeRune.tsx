import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Button, Modal, Card, Icon, Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Information } from 'components/Information'
import { Input } from 'components/Input'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const runeAsset = Asset.BNB_RUNE()

const UpgradeRune = () => {
  const [isOpened, setIsOpened] = useState(false)
  const [value, setValue] = useState('0')
  const [address, setAddress] = useState('')

  const asset: AssetInputType = { asset: runeAsset, price: '10.50', value }

  return (
    <Box className="self-center w-full max-w-[480px]" col>
      <Helmet title="Upgrade Rune" content="Upgrade BNB Rune" />

      <Box className="w-full mx-2" col>
        <ViewHeader
          title="Upgrade BNB Rune"
          actionsComponent={
            <Box row className="space-x-4">
              <Icon color="secondary" name="chart" className="ml-auto" />
            </Box>
          }
        />
      </Box>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
        stretch
      >
        <Box col className="gap-y-4" flex={1}>
          <AssetInput
            singleAsset
            onValueChange={setValue}
            className="!mb-1"
            selectedAsset={asset}
            secondary
          />

          <Information label={t('common.transactionFee')} value="0.00075 BNB" />

          <Box col>
            <Input
              border="bottom"
              className="text-lg"
              value={address}
              stretch
              placeholder={t('common.recipientAddress')}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Box>
        </Box>

        <Box className="w-full pt-5">
          <Button stretch size="lg" onClick={() => setIsOpened(true)}>
            {t('common.upgrade')}
          </Button>

          {isOpened && (
            <Modal
              title="Upgrade"
              isOpened={isOpened}
              onClose={() => setIsOpened(false)}
            >
              {/*  */}
            </Modal>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default UpgradeRune
