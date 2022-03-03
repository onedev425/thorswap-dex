import { InboundAddressesItem } from '@thorswap-lib/midgard-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'
import { Chain } from '@thorswap-lib/xchain-util'
import axios from 'axios'

const multiplier: Record<FeeOption, number> = {
  average: 0.67,
  fast: 1,
  fastest: 1.5,
}

// Reference issue: https://github.com/thorchain/asgardex-electron/issues/1381
export const getGasRateByChain = ({
  inboundData,
  chain,
}: {
  inboundData: InboundAddressesItem[]
  chain: Chain
}): number => {
  const chainInboundData = inboundData.find((data) => data.chain === chain)

  return Number(chainInboundData?.gas_rate ?? 0)
}

/// get doge gasrate from blockcypher oracle
export const getDogeGasRate = async () => {
  const DEFAULT_SUGGESTED_TRANSACTION_FEE = 500000
  try {
    const response = await axios.get('https://api.blockcypher.com/v1/doge/main')
    return response.data.high_fee_per_kb / 1000 // feePerKb to feePerByte
  } catch (error) {
    return DEFAULT_SUGGESTED_TRANSACTION_FEE
  }
}

export const getGasRateByFeeOption = ({
  inboundData,
  chain,
  feeOptionType,
}: {
  inboundData: InboundAddressesItem[]
  chain: Chain
  feeOptionType: FeeOption
}) => {
  return getGasRateByChain({ inboundData, chain }) * multiplier[feeOptionType]
}
