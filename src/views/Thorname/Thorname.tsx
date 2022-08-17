import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Asset, THORName } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { isKeystoreSignRequired } from 'helpers/wallet'

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
  const [isOpened, setIsOpened] = useState(false)
  const [step, setStep] = useState(0)
  const chainWalletAddress = wallet?.[chain]?.address

  const isKeystoreSigningRequired = useMemo(
    () => isKeystoreSignRequired({ wallet, inputAssets: [Asset.RUNE()] }),
    [wallet],
  )

  const { data: thornameInfoItems } = useThornameInfoItems({
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

  const registeredChains = useMemo(
    () => (details ? details?.entries.map((e) => e.chain) : []),
    [details],
  )

  const handleSubmit = useCallback(async () => {
    if (disabled) return

    if (!(details || available)) {
      setStep(1)
      return lookupForTNS()
    }

    if (thorAddress && address && validAddress) {
      registerThornameAddress(address)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [
    disabled,
    details,
    available,
    thorAddress,
    address,
    validAddress,
    lookupForTNS,
    registerThornameAddress,
    setIsConnectModalOpen,
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

    if (available) {
      return thorAddress
        ? registeredChains.length > 0
          ? t('common.update')
          : t('views.thorname.purchase')
        : t('common.connectWallet')
    }

    return t('views.wallet.search')
  }, [unavailableForPurchase, available, thorAddress, registeredChains.length])

  useEffect(() => {
    if (chainWalletAddress) {
      setAddress(chainWalletAddress)
    } else if (chainWalletAddress === undefined) {
      setAddress('')
    }
  }, [chainWalletAddress, chain])

  useEffect(() => {
    if (address) {
      const isValidAddress = multichain().validateAddress({ chain, address })
      setValidAddress(isValidAddress)
    }
  }, [address, chain])

  const handleResetThorname = () => {
    setThorname('')
    setStep(0)
  }

  return (
    <PanelView
      header={
        <Box col>
          <ViewHeader title={t('components.sidebar.thorname')} />

          <Box justify="between" className="px-2.5 pt-1">
            <Typography color="secondary" fontWeight="medium" variant="caption">
              {t('views.thorname.thornameSubtitle')}
            </Typography>

            <Tooltip place="bottom" content={t('views.thorname.thornameInfo')}>
              <Icon name="infoCircle" size={24} color="primaryBtn" />
            </Tooltip>
          </Box>
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
        onClick={handleResetThorname}
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
              onClick={handleResetThorname}
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
          onClick={() => {
            if (step === 1 && thorAddress && isKeystoreSigningRequired) {
              setIsOpened(true)
            } else {
              handleSubmit()
            }
          }}
        >
          {buttonLabel}
        </Button>
      </Box>

      {!details && <RegisteredThornames editThorname={editThorname} />}
      <ConfirmModal
        inputAssets={[Asset.RUNE()]}
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        onConfirm={() => {
          handleSubmit()
          setIsOpened(false)
        }}
      >
        {details ? (
          <Box col>
            <InfoRow label="THORName" value={thorname} />
            <InfoRow label={t('view.thorname.cost')} value={years} />
          </Box>
        ) : (
          <Box col>
            <InfoRow label="THORName" value={thorname} />
            <InfoRow
              label={t('view.thorname.cost')}
              value={THORName.getCost(years).toSignificant(6)}
            />
            <InfoRow label={t('view.thorname.duration')} value={years} />
          </Box>
        )}
      </ConfirmModal>
    </PanelView>
  )
}

export default Thorname
