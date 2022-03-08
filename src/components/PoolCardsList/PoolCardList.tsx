import { Asset } from '@thorswap-lib/multichain-sdk'

import { PoolCard } from 'components/PoolCard'
import { PoolCardProps } from 'components/PoolCard/types'

export const PoolCardList = () => {
  const Data: PoolCardProps[] = [
    {
      asset: Asset.BTC(),
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: -1.5,
    },
    {
      asset: Asset.ETH(),
      price: 3400,
      color: 'purple',
      iconName: 'ethereum',
      change: 5,
    },
    {
      asset: Asset.BNB(),
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: 2.5,
    },
    {
      asset: Asset.BTC(),
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: 1.5,
    },
    {
      asset: Asset.ETH(),
      price: 3400,
      color: 'purple',
      iconName: 'ethereum',
      change: -5,
    },
    {
      asset: Asset.BNB(),
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: -2.5,
    },
    {
      asset: Asset.BNB(),
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: 2.5,
    },
    {
      asset: Asset.BTC(),
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: 1.5,
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5"'>
      {Data.map((data: PoolCardProps) => (
        <PoolCard key={data.asset.ticker} {...data} />
      ))}
    </div>
  )
}
