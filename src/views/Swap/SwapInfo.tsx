import { memo } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { Collapse } from 'components/Collapse'
import { Icon } from 'components/Icon'
import { Information } from 'components/Information'
import { Typography } from 'components/Typography'

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
        shadow={false}
        className="self-stretch"
        title={
          <div className="flex flex-row gap-x-2">
            <Icon name="info" size={16} color="secondary" />

            <Typography variant="caption" color="primary" fontWeight="normal">
              {`1 ${secondAsset.name} = ${
                parseFloat(firstAsset.value) / parseFloat(secondAsset.value)
              } ${firstAsset.name}`}
            </Typography>

            <Typography variant="caption" color="secondary" fontWeight="normal">
              ($ {secondAsset.value})
            </Typography>
          </div>
        }
      >
        <Information
          showBorder={false}
          label="Expected Output"
          value={`${secondAsset.balance} ${secondAsset.name}`}
        />

        <Information
          label="Price Impact"
          value={
            <Typography color={priceImpact >= 0 ? 'green' : 'red'}>
              {priceImpact}%
            </Typography>
          }
        />

        <Information
          showBorder={false}
          label={`Minimum receiver after slippage (${slippage.toFixed(2)}%)`}
          value={`${
            parseFloat(secondAsset?.balance || '0') * (1 - slippage / 100)
          } ${secondAsset.name}`}
        />
      </Collapse>
    )
  },
)
