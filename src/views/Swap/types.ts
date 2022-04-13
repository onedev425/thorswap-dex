import { Asset } from '@thorswap-lib/multichain-sdk'

export type RouterStepProps = {
  assets: [Asset, Asset]
  commission: string
}

export type Pair = {
  inputAsset: Asset
  outputAsset: Asset
}
