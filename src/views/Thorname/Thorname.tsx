import { Text } from '@chakra-ui/react';
import { Chain, getTHORNameCost } from '@swapkit/core';
import { Box, Button, Collapse, Icon, Tooltip } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { HighlightCard } from 'components/HighlightCard';
import { InfoRow } from 'components/InfoRow';
import { InfoTable } from 'components/InfoTable';
import { Input } from 'components/Input';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelView } from 'components/PanelView';
import { showErrorToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { useKeystore, useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { shortenAddress } from 'helpers/shortenAddress';
import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';

import { ChainDropdown } from './ChainDropdown';
import { RegisteredThornames } from './RegisteredThornames';
import { useThornameInfoItems } from './useThornameInfoItems';
import { useThornameLookup } from './useThornameLookup';

const Thorname = () => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { isWalletLoading, getWalletAddress } = useWallet();
  const { signingRequired } = useKeystore();
  const thorAddress = getWalletAddress(Chain.THORChain);
  const {
    available,
    chain,
    details,
    loading,
    registerThornameAddress,
    lookupForTNS,
    setChain,
    setSearchedThorname,
    setCurrentThorname,
    setYears,
    currentThorname,
    searchedThorname,
    years,
  } = useThornameLookup(thorAddress);
  const [validAddress, setValidAddress] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [transferAddress, setTransferAddress] = useState<string>('');

  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedTransfer, setIsOpenedTransfer] = useState(false);

  const [step, setStep] = useState(0);
  const chainWalletAddress = getWalletAddress(chain);

  const isKeystoreSigningRequired = useMemo(() => signingRequired([RUNEAsset]), [signingRequired]);

  const { data: thornameInfoItems } = useThornameInfoItems({
    years,
    setYears,
    thorname: searchedThorname,
    details,
    available,
  });

  const unavailableForPurchase = useMemo(
    () => details && details?.owner !== thorAddress,
    [details, thorAddress],
  );

  const disabled = useMemo(
    () =>
      (currentThorname.length === 0 || unavailableForPurchase || (!!address && !validAddress)) &&
      (currentThorname === searchedThorname || currentThorname.length === 0),
    [address, currentThorname, searchedThorname, unavailableForPurchase, validAddress],
  );

  const registeredChains = useMemo(
    () => (details?.entries?.length ? details.entries.map((e) => e.chain) : []),
    [details],
  );

  const handleAction = useCallback(() => {
    if (disabled) return;
    setSearchedThorname(currentThorname);
    if (!(details || available) || currentThorname !== searchedThorname) {
      setStep(1);
      return lookupForTNS(currentThorname);
    }

    if (thorAddress && address && validAddress) {
      registerThornameAddress(address);
    } else {
      setIsConnectModalOpen(true);
    }
  }, [
    disabled,
    setSearchedThorname,
    currentThorname,
    searchedThorname,
    details,
    available,
    setStep,
    lookupForTNS,
    thorAddress,
    address,
    validAddress,
    registerThornameAddress,
    setIsConnectModalOpen,
  ]);

  const handleSubmit = useCallback(() => {
    handleAction();
  }, [handleAction]);

  const handleEnterKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleAction();
      }
    },
    [handleAction],
  );

  const handleChainChange = useCallback((chain: string) => setChain(chain as Chain), [setChain]);

  const editThorname = useCallback(
    (thorname: string) => {
      setCurrentThorname(thorname);
      setSearchedThorname(thorname);
      lookupForTNS(thorname);
    },
    [lookupForTNS, setSearchedThorname, setCurrentThorname],
  );

  const buttonLabel = useMemo(() => {
    if (currentThorname !== searchedThorname && searchedThorname !== '') {
      return t('common.refresh');
    }
    if (unavailableForPurchase) {
      return t('views.thorname.unavailableForPurchase');
    }

    if (available) {
      return thorAddress
        ? registeredChains.length > 0
          ? t('common.update')
          : t('views.thorname.purchase')
        : t('common.connectWallet');
    }

    return t('views.wallet.search');
  }, [
    unavailableForPurchase,
    available,
    thorAddress,
    registeredChains.length,
    currentThorname,
    searchedThorname,
  ]);

  const onTransfer = useCallback(async () => {
    const { validateAddress } = await (await import('services/swapKit')).getSwapKitClient();

    const isValidAddress = validateAddress({
      chain: Chain.THORChain,
      address: transferAddress || '',
    });

    if (!isValidAddress) {
      return showErrorToast(
        t('views.thorname.invalidTransferAddress'),
        t('views.thorname.inputValidThorAddress'),
      );
    }

    setIsOpenedTransfer(true);
  }, [transferAddress]);

  useEffect(() => {
    if (chainWalletAddress) {
      setAddress(chainWalletAddress);
    } else if (chainWalletAddress === undefined) {
      setAddress('');
    }
  }, [chainWalletAddress, chain]);

  useEffect(() => {
    if (address) {
      import('services/swapKit')
        .then(({ getSwapKitClient }) => getSwapKitClient())
        .then(({ validateAddress }) => setValidAddress(!!validateAddress({ chain, address })));
    }
  }, [address, chain]);

  const handleResetThorname = () => {
    setSearchedThorname('');
    setCurrentThorname('');
    setStep(0);
  };
  return (
    <PanelView
      description={t('views.thorname.description')}
      header={
        <Box col>
          <ViewHeader title={t('components.sidebar.thorname')} />

          <Box className="px-2.5 pt-1" justify="between">
            <Text fontWeight="medium" textStyle="caption" variant="secondary">
              {t('views.thorname.thornameSubtitle')}
            </Text>

            <Tooltip content={t('views.thorname.thornameInfo')} place="bottom">
              <Icon color="primaryBtn" name="infoCircle" size={24} />
            </Tooltip>
          </Box>
        </Box>
      }
      keywords="THORName, THORSwap, THORChain, DEFI, DEX"
      title={t('views.thorname.title')}
    >
      <Input
        autoFocus
        stretch
        border="rounded"
        className="!text-md p-1.5 flex-1 border"
        containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
        onChange={(e) => setCurrentThorname(e.target.value)}
        onKeyDown={handleEnterKeyDown}
        placeholder={t('views.thorname.checkNameAvailability')}
        suffix={
          currentThorname && <Icon color="secondary" name="close" onClick={handleResetThorname} />
        }
        value={currentThorname}
      />
      {available && details && (
        <HighlightCard className="!mt-2 !p-0 w-full">
          <Collapse
            className="!py-1"
            shadow={false}
            title={
              <Box className="flex justify-between w-full">
                <Text fontWeight="medium" variant="secondary">
                  {t('components.sidebar.thorname')}
                </Text>
                <Text className="text-right" fontWeight="semibold" variant="primary">
                  {searchedThorname}
                </Text>
              </Box>
            }
          >
            <Box col className="gap-4">
              <Box col>
                <FieldLabel label={t('views.thorname.transferTHORName')} />
                <Box row className="w-full gap-x-4">
                  <Input
                    autoFocus
                    stretch
                    border="rounded"
                    className="!text-md !p-1.5 border pt-5"
                    containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
                    onChange={({ target }) => setTransferAddress(target.value)}
                    placeholder={`${Chain.THORChain} ${t('common.address')}`}
                    value={transferAddress || ''}
                  />
                </Box>
              </Box>
              <Button
                stretch
                disabled={!transferAddress}
                error={!!details && available && !validAddress}
                loading={isWalletLoading || loading}
                onClick={onTransfer}
                size="sm"
                variant="secondary"
              >
                {t('common.transfer')}
              </Button>
            </Box>
          </Collapse>
        </HighlightCard>
      )}

      <InfoTable horizontalInset items={thornameInfoItems} size="lg" />

      {available && details?.owner === thorAddress && (
        <Box row className="w-full pt-4">
          <ChainDropdown chain={chain} onChange={handleChainChange} />

          <Input
            autoFocus
            stretch
            border="rounded"
            className="!text-md !p-1.5 border"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
            onChange={({ target }) => setAddress(target.value)}
            placeholder={`${chain} ${t('common.address')}`}
            value={address || ''}
          />
        </Box>
      )}
      <Box className="w-full pt-6">
        <Button
          stretch
          disabled={disabled}
          error={!!details && available && !validAddress}
          loading={isWalletLoading || loading}
          onClick={() => {
            if (
              step === 1 &&
              thorAddress &&
              isKeystoreSigningRequired &&
              searchedThorname === currentThorname
            ) {
              setIsOpened(true);
            } else {
              handleSubmit();
            }
          }}
          size="lg"
          variant="fancy"
        >
          {buttonLabel}
        </Button>
      </Box>

      {!details && <RegisteredThornames editThorname={editThorname} />}

      <ConfirmModal
        inputAssets={[RUNEAsset]}
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        onConfirm={() => {
          handleSubmit();
          setIsOpened(false);
        }}
      >
        {details ? (
          <Box col>
            <InfoRow label="THORName" value={searchedThorname} />
            <InfoRow
              capitalizeLabel
              label={t('view.thorname.cost')}
              value={`${getTHORNameCost(Math.max(0, years - 10))} RUNE`}
            />
            {years > 0 && (
              <InfoRow
                capitalizeLabel
                label={t('view.thorname.duration')}
                value={`${years} ${years > 1 ? t('view.thorname.years') : t('view.thorname.year')}`}
              />
            )}
          </Box>
        ) : (
          <Box col>
            <InfoRow label="THORName" value={searchedThorname} />
            <InfoRow
              capitalizeLabel
              label={t('view.thorname.cost')}
              value={`${getTHORNameCost(years)} RUNE`}
            />
            <InfoRow
              capitalizeLabel
              label={t('view.thorname.duration')}
              value={`${years} ${years > 1 ? t('view.thorname.years') : t('view.thorname.year')}`}
            />
          </Box>
        )}
      </ConfirmModal>

      <ConfirmModal
        inputAssets={[RUNEAsset]}
        isOpened={isOpenedTransfer}
        onClose={() => setIsOpenedTransfer(false)}
        onConfirm={() => {
          registerThornameAddress(address || '', transferAddress);
          setIsOpenedTransfer(false);
        }}
      >
        <Box col>
          <InfoRow label="THORName" value={searchedThorname} />
          <InfoRow
            capitalizeLabel
            label={t('common.transferAddress')}
            value={shortenAddress(transferAddress, 6, 8)}
          />
        </Box>
      </ConfirmModal>
    </PanelView>
  );
};

export default Thorname;
