import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  KeyboardEventHandler,
} from 'react'

import { isKeystoreSignRequired, Asset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'

import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { PasswordInput } from 'components/PasswordInput'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { ChainDropdown } from './ChainDropdown'
import { RegisteredThornames } from './RegisteredThornames'
import { useThornameInfoItems } from './useThornameInfoItems'
import { useThornameLookup } from './useThornameLookup'

const Thorname = () => {
  const { isWalletLoading, wallet, setIsConnectModalOpen, keystore } =
    useWallet()
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

  const [invalidPassword, setInvalidPassword] = useState(false)
  const [validating, setValidating] = useState(false)
  const [password, setPassword] = useState('')

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
      return lookupForTNS()
    }

    if (thorAddress && address && validAddress && isKeystoreSigningRequired) {
      if (!keystore) return
      try {
        setValidating(true)

        const isValid = await multichain.validateKeystore(keystore, password)

        if (isValid) {
          if (registeredChains.length === 0) {
            registerThornameAddress(address)
          } else {
            registerThornameAddress(address)
            setValidating(false)
          }
        } else {
          setInvalidPassword(true)
          setValidating(false)
        }
      } catch (error) {
        setInvalidPassword(true)
        setValidating(false)
      }
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
    isKeystoreSigningRequired,
    lookupForTNS,
    keystore,
    password,
    registeredChains.length,
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
      const isValidAddress = multichain.validateAddress({ chain, address })
      setValidAddress(isValidAddress)
    }
  }, [address, chain])

  const onPasswordKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.code === 'Enter' && !validating) {
        handleSubmit()
      }
    },
    [handleSubmit, validating],
  )

  const handlePassword = (password: string) => {
    setPassword(password)
    if (invalidPassword) {
      setInvalidPassword(false)
    }
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

      {isKeystoreSigningRequired && thorAddress && (
        <Box col className="w-full pt-4 ">
          <PasswordInput
            value={password}
            onChange={({ target }) => handlePassword(target.value)}
            onKeyDown={onPasswordKeyDown}
          />
          {invalidPassword && (
            <Typography
              className="ml-2"
              color="orange"
              variant="caption"
              fontWeight="medium"
            >
              {t('views.walletModal.wrongPassword')}
            </Typography>
          )}
        </Box>
      )}

      <Box className="w-full pt-6">
        <Button
          loading={isWalletLoading || loading}
          isFancy
          size="lg"
          stretch
          error={(!!details && available && !validAddress) || invalidPassword}
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
