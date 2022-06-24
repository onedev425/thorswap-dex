import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { ChainDropdown } from './ChainDropdown'
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
    years,
  } = useThornameLookup(thorAddress)
  const [validAddress, setValidAddress] = useState(false)
  const [address, setAddress] = useState<null | string>(null)
  const chainWalletAddress = wallet?.[chain]?.address

  const thornameInfoItems = useThornameInfoItems({
    years,
    setYears,
    thorname,
    details,
    available,
  })

  const unavailableForPurchase = useMemo(
    () => details && details?.owner !== thorAddress,
    [details, thorAddress],
  )

  const disabled = useMemo(
    () =>
      thorname.length === 0 ||
      unavailableForPurchase ||
      (!!address && !validAddress),
    [address, thorname.length, unavailableForPurchase, validAddress],
  )

  const handleSubmit = useCallback(() => {
    if (disabled) return

    if (!(details || available)) {
      return lookupForTNS()
    }

    if (thorAddress && address && validAddress) {
      registerThornameAddress(address)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [
    available,
    address,
    details,
    disabled,
    lookupForTNS,
    registerThornameAddress,
    setIsConnectModalOpen,
    thorAddress,
    validAddress,
  ])

  const handleEnterKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return

      if (event.key === 'Enter') {
        lookupForTNS()
      }
    },
    [lookupForTNS, disabled],
  )

  const handleChainChange = useCallback(
    (chain: string) => setChain(chain as SupportedChain),
    [setChain],
  )

  const editThorname = useCallback(
    (thorname: string) => {
      setThorname(thorname)
      lookupForTNS(thorname)
    },
    [lookupForTNS, setThorname],
  )

  const buttonLabel = useMemo(() => {
    if (unavailableForPurchase) {
      return t('views.thorname.unavailableForPurchase')
    }

    const registeredChains = details ? details?.entries.map((e) => e.chain) : []

    if (available) {
      return thorAddress
        ? registeredChains.includes(chain)
          ? t('common.update')
          : t('views.thorname.purchase')
        : t('common.connectWallet')
    }

    return t('views.wallet.search')
  }, [unavailableForPurchase, details, available, thorAddress, chain])

  useEffect(() => {
    if (chainWalletAddress) {
      setAddress(chainWalletAddress)
    }
  }, [chainWalletAddress, chain])

  useEffect(() => {
    if (address) {
      const isValidAddress = multichain.validateAddress({ chain, address })
      setValidAddress(isValidAddress)
    }
  }, [address, chain])

  return (
    <PanelView
      header={
        <Box col>
          <ViewHeader title={t('components.sidebar.thorname')} />

          <Typography
            className="pl-3 pt-1"
            color="secondary"
            fontWeight="medium"
            variant="caption"
          >
            {t('views.stakingVThor.stakeVThorSubtitle')}
          </Typography>
        </Box>
      }
      title={t('views.thorname.searchName')}
    >
      <Input
        autoFocus
        border="rounded"
        className="!text-md p-1.5 flex-1 border"
        containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
        disabled={!!details}
        onClick={() => setThorname('')}
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

      {available && details?.owner === thorAddress && (
        <Box row className="w-full pt-4 gap-x-4">
          <ChainDropdown
            details={details}
            chain={chain}
            onChange={handleChainChange}
          />

          <Input
            autoFocus
            border="rounded"
            className="!text-md !p-1.5 border"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
            stretch
            onChange={({ target }) => setAddress(target.value)}
            placeholder={`${chain} ${t('common.address')}`}
            value={address || ''}
          />
        </Box>
      )}

      <Box className="w-full pt-6">
        <Button
          loading={isWalletLoading || loading}
          isFancy
          size="lg"
          stretch
          error={!!details && available && !validAddress}
          disabled={disabled}
          onClick={handleSubmit}
        >
          {buttonLabel}
        </Button>
      </Box>

      {!details && <RegisteredThornames editThorname={editThorname} />}
    </PanelView>
  )
}

export default Thorname
