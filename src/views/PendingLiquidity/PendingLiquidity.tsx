// import { useState } from 'react'

// import { Asset } from '@thorswap-lib/multichain-sdk'

import { PendingDeposit } from 'views/PendingLiquidity/PendingDeposit'

// import { AssetInput } from 'components/AssetInput'
import { Box, Button, Icon } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

// import { formatPrice } from 'helpers/formatPrice'

const data = [
  { label: t('views.wallet.slip'), value: '0.54' },
  { label: t('views.liquidity.poolShareEstimated'), value: '8.248' },
  { label: t('common.transactionFee'), value: '0.02 RUNE' },
]

export const PendingLiquidity = () => {
  // const [value, setValue] = useState('0')

  // const runeAsset = {
  //   asset: Asset.RUNE(),
  //   value: 'Pending $(335.39K)',
  //   price: '0',
  // }
  // const thorAsset = {
  //   asset: Asset.THOR(),
  //   value: '0',
  //   price: '0',
  // }

  return (
    <PanelView
      title={t('pendingLiquidity.pendingLiquidity')}
      header={
        <ViewHeader
          title={t('views.pendingLiquidity.pendingLiquidity')}
          actionsComponent={
            <Box className="gap-8" row>
              <Icon color="secondary" name="chart" className="ml-auto" />
              <Icon name="cog" color="secondary" />
            </Box>
          }
        />
      }
    >
      <Button stretch type="outline" className="mb-2">
        {t('views.pendingLiquidity.checkPendingLiquidity')}
      </Button>

      <PendingDeposit />
      {/* 
      <AssetInput
        secondaryLabel={`Add to Complete (${formatPrice(parseFloat(value))})`}
        className="self-stretch"
        selectedAsset={thorAsset}
        singleAsset
        onValueChange={setValue}
      />
      <AssetInput
        secondaryLabel={formatPrice(22212.2, { prefix: '' })}
        className="self-stretch"
        selectedAsset={runeAsset}
        singleAsset
        inputClassName="!text-xl md:!text-2xl"
        onValueChange={() => {}}
      /> */}

      <InfoTable items={data} />

      <Box className="w-full pt-5">
        <Button stretch size="lg">
          {t('views.pendingLiquidity.insufficientAmount')}
        </Button>
      </Box>
    </PanelView>
  )
}
