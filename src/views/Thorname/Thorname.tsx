import { Text } from '@chakra-ui/react';
import { getTHORNameCost } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
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
import { RUNEAsset } from 'helpers/assets';
import { shortenAddress } from 'helpers/shortenAddress';
import { isKeystoreSignRequired } from 'helpers/wallet';
import { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

import { ChainDropdown } from './ChainDropdown';
import { RegisteredThornames } from './RegisteredThornames';
import { useThornameInfoItems } from './useThornameInfoItems';
import { useThornameLookup } from './useThornameLookup';

const Thorname = () => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet();
  const thorAddress = wallet?.THOR?.address;
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
  } = useThornameLookup(thorAddress);
  const [validAddress, setValidAddress] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [transferAddress, setTransferAddress] = useState<string>('');

  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedTransfer, setIsOpenedTransfer] = useState(false);

  const [step, setStep] = useState(0);
  const chainWalletAddress = wallet?.[chain]?.address;

  const isKeystoreSigningRequired = useMemo(
    () => isKeystoreSignRequired({ wallet, inputAssets: [RUNEAsset] }),
    [wallet],
  );

  const { data: thornameInfoItems } = useThornameInfoItems({
    years,
    setYears,
    thorname,
    details,
    available,
  });

  const unavailableForPurchase = useMemo(
    () => details && details?.owner !== thorAddress,
    [details, thorAddress],
  );

  const disabled = useMemo(
    () => thorname.length === 0 || unavailableForPurchase || (!!address && !validAddress),
    [address, thorname.length, unavailableForPurchase, validAddress],
  );

  const registeredChains = useMemo(
    () => (details ? details?.entries.map((e) => e.chain) : []),
    [details],
  );

  const handleSubmit = useCallback(async () => {
    if (disabled) return;
    if (!(details || available)) {
      setStep(1);
      return lookupForTNS();
    }

    if (thorAddress && address && validAddress) {
      registerThornameAddress(address);
    } else {
      setIsConnectModalOpen(true);
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
  ]);

  const handleEnterKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      if (event.key === 'Enter') {
        setStep(1);
        lookupForTNS();
      }
    },
    [lookupForTNS, disabled],
  );

  const handleChainChange = useCallback((chain: string) => setChain(chain as Chain), [setChain]);

  const editThorname = useCallback(
    (thorname: string) => {
      setThorname(thorname);
      lookupForTNS(thorname);
    },
    [lookupForTNS, setThorname],
  );

  const buttonLabel = useMemo(() => {
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
  }, [unavailableForPurchase, available, thorAddress, registeredChains.length]);

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
    setThorname('');
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
        disabled={!!details}
        onChange={(e) => setThorname(e.target.value)}
        onClick={handleResetThorname}
        onKeyDown={handleEnterKeyDown}
        placeholder={t('views.thorname.checkNameAvailability')}
        suffix={thorname && <Icon color="secondary" name="close" onClick={handleResetThorname} />}
        value={thorname}
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
                  {thorname}
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
            if (step === 1 && thorAddress && isKeystoreSigningRequired) {
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
            <InfoRow label="THORName" value={thorname} />
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
            <InfoRow label="THORName" value={thorname} />
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
          <InfoRow label="THORName" value={thorname} />
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
