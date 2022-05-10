import { KeyboardEvent, useCallback, useMemo } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Icon } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

import { ChainDropdown, thornameChainIcons } from './ChainDropdown'
import { RegisteredThornames } from './RegisteredThornames'
import { useThornameInfoItems } from './useThornameInfoItems'
import { useThornameLookup } from './useThornameLookup'

const Thorname = () => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
  const thorAddress = wallet?.THOR?.address
  const {
    available,
    chain,
    details,
    loading,
    registerThornameAddress,
    lookupForTNS,
    setChain,
    setThorname,
    setYears,
    thorname,
    registeredThornames,
    years,
  } = useThornameLookup(thorAddress)
  const chainWalletAddress = wallet?.[chain]?.address

  const thornameInfoItems = useThornameInfoItems({
    years,
    setYears,
    thorname,
    details,
    available,
  })

  const handleSubmit = useCallback(() => {
    if (!(details || available)) {
      return lookupForTNS()
    }

    if (thorAddress && chainWalletAddress) {
      registerThornameAddress(chainWalletAddress)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [
    available,
    chainWalletAddress,
    details,
    lookupForTNS,
    registerThornameAddress,
    setIsConnectModalOpen,
    thorAddress,
  ])

  const handleEnterKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        lookupForTNS()
      }
    },
    [lookupForTNS],
  )

  const handleChainChange = useCallback(
    (chain: string) => setChain(chain as SupportedChain),
    [setChain],
  )

  const allAddressesLocked = useMemo(() => {
    if (!details) return false

    const availableChains = Object.keys(thornameChainIcons)
    const registeredChains = details.entries.map(({ chain }) => chain)
    return (
      availableChains.filter((chain) => !registeredChains.includes(chain))
        .length === 0
    )
  }, [details])

  const buttonLabel = useMemo(() => {
    if (allAddressesLocked || (details && details?.owner !== thorAddress)) {
      return t('views.thorname.unavailableForPurchase')
    }

    if (available) {
      return thorAddress && chainWalletAddress
        ? t('views.thorname.purchase')
        : t('common.connectWallet')
    }

    return t('views.wallet.search')
  }, [allAddressesLocked, details, thorAddress, available, chainWalletAddress])

  return (
    <PanelView
      header={<ViewHeader title={t('components.sidebar.thorname')} />}
      title={t('views.thorname.searchName')}
    >
      <Input
        autoFocus
        border="rounded"
        className="!text-md p-1.5 flex-1 border"
        containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
        disabled={!!details}
        onChange={(e) => setThorname(e.target.value)}
        onKeyDown={handleEnterKeyDown}
        placeholder={t('views.thorname.checkNameAvailability')}
        stretch
        value={thorname}
        suffix={
          thorname && (
            <Icon
              name="close"
              color="secondary"
              onClick={() => setThorname('')}
            />
          )
        }
      />

      <InfoTable size="lg" items={thornameInfoItems} horizontalInset />

      {available && !allAddressesLocked && (
        <Box row className="w-full pt-4 gap-x-4">
          <ChainDropdown
            details={details}
            chain={chain}
            onChange={handleChainChange}
          />

          <Input
            autoFocus
            border="rounded"
            className="!text-md p-1.5 flex-1 border"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
            stretch
            onChange={() => {}}
            placeholder={`${chain} ${t('common.address')}`}
            value={chainWalletAddress || ''}
          />
        </Box>
      )}

      <Box className="w-full pt-6">
        <Button
          loading={isWalletLoading || loading}
          isFancy
          size="lg"
          stretch
          disabled={!(thorname.length || details) || allAddressesLocked}
          onClick={handleSubmit}
        >
          {buttonLabel}
        </Button>
      </Box>

      {!details && <RegisteredThornames thornames={registeredThornames} />}
    </PanelView>
  )
}

export default Thorname
