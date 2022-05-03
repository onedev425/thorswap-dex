import { KeyboardEvent, useCallback, useMemo } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Icon } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

import { ChainDropdown } from './ChainDropdown'
import { useThornameInfoItems } from './useThornameInfoItems'
import { useThornameLookup } from './useThornameLookup'

const Thorname = () => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
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
    years,
  } = useThornameLookup()
  const chainWallet = wallet?.[chain]

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

    if (wallet?.THOR && chainWallet) {
      registerThornameAddress(chainWallet?.address)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [
    available,
    chainWallet,
    details,
    lookupForTNS,
    registerThornameAddress,
    setIsConnectModalOpen,
    wallet?.THOR,
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

  const buttonLabel = useMemo(() => {
    if (details) return t('common.notAvailable')

    if (available) {
      return wallet?.THOR && chainWallet
        ? t('views.thorname.purchase')
        : t('common.connectWallet')
    }

    return t('views.wallet.search')
  }, [details, available, wallet?.THOR, chainWallet])

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
        disabled={available}
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

      {available && (
        <Box row className="w-full pt-4 gap-x-4">
          <ChainDropdown chain={chain} onChange={handleChainChange} />

          <Input
            autoFocus
            border="rounded"
            className="!text-md p-1.5 flex-1 border"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
            stretch
            onChange={() => {}}
            placeholder={`${chain} ${t('common.address')}`}
            value={chainWallet ? chainWallet.address : ''}
          />
        </Box>
      )}

      <Box className="w-full pt-6">
        <Button
          loading={isWalletLoading || loading}
          isFancy
          size="lg"
          stretch
          disabled={!(thorname.length || details)}
          onClick={handleSubmit}
        >
          {buttonLabel}
        </Button>
      </Box>
    </PanelView>
  )
}

export default Thorname
