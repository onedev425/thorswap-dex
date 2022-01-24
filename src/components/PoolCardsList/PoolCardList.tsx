import { PoolCard } from '../PoolCard'
import { PoolCardProps } from '../PoolCard/types'

export const PoolCardList = () => {
  const Data: PoolCardProps[] = [
    {
      coinSymbol: 'btc',
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: -1.5,
    },
    {
      coinSymbol: 'eth',
      price: 3400,
      color: 'purple',
      iconName: 'ethereum',
      change: 5,
    },
    {
      coinSymbol: 'BNB',
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: 2.5,
    },
    {
      coinSymbol: 'btc',
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: 1.5,
    },
    {
      coinSymbol: 'eth',
      price: 3400,
      color: 'purple',
      iconName: 'ethereum',
      change: -5,
    },
    {
      coinSymbol: 'BNB',
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: -2.5,
    },
    {
      coinSymbol: 'BNB',
      price: 450,
      color: 'yellow',
      iconName: 'binance',
      change: 2.5,
    },
    {
      coinSymbol: 'btc',
      price: 65000,
      color: 'orange',
      iconName: 'bitcoin',
      change: 1.5,
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5"'>
      {Data.map((data: PoolCardProps) => (
        <PoolCard key={data.coinSymbol} {...data} />
      ))}
    </div>
  )
}
