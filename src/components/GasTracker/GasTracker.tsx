import { useMemo } from 'react'

import { DropdownMenu } from 'components/Atomic'

import { useGasRate } from 'hooks/useGasRate'

export const GasTracker = () => {
  const { chainGasRates } = useGasRate()

  const menuItems = useMemo(() => {
    return chainGasRates.map(({ chain, gasRate, gasUnit }) => {
      return {
        Component: (
          <div>
            {chain} {gasRate} {gasUnit}
          </div>
        ),
        value: chain,
      }
    })
  }, [chainGasRates])

  return (
    <DropdownMenu
      menuItems={menuItems}
      value="Network Status"
      openLabel="Gas Tracker"
      onChange={() => {}}
    />
  )
}
