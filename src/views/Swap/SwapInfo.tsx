import { memo } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { Collapse, Icon, Typography } from 'components/Atomic'
import { Information } from 'components/Information'

type Props = {
  firstAsset: AssetInputType
  secondAsset: AssetInputType
  priceImpact: number
  slippage: number
}

export const SwapInfo = memo(
  ({ priceImpact, slippage, secondAsset, firstAsset }: Props) => {
    return (
      <Collapse
        className="self-stretch"
        shadow={false}
        title={
          <div className="flex flex-row gap-x-2">
            <Icon name="info" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {`1 ${secondAsset.asset.symbol} = ${
                parseFloat(firstAsset.value) / parseFloat(secondAsset.value)
              } ${firstAsset.asset.symbol}`}
            </Typography>

            <Typography variant="caption" color="secondary" fontWeight="normal">
              {`($ ${secondAsset.value})`}
            </Typography>
          </div>
        }
      >
        <Information
          showBorder={false}
          label="Expected Output"
          value={`${secondAsset.balance} ${secondAsset.asset.symbol}`}
        />

        <Information
          label="Price Impact"
          value={
            <Typography color={priceImpact >= 0 ? 'green' : 'red'}>
              {`${priceImpact}%`}
            </Typography>
          }
        />

        <Information
          showBorder={false}
          label={`Minimum receiver after slippage (${slippage.toFixed(2)}%)`}
          value={`${
            parseFloat(secondAsset?.balance || '0') * (1 - slippage / 100)
          } ${secondAsset.asset.symbol}`}
        />
      </Collapse>
    )
  },
)
