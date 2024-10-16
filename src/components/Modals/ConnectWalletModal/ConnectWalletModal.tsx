import { Link, Text } from "@chakra-ui/react";
import type { DerivationPathArray, WalletChain } from "@swapkit/sdk";
import { Chain, DerivationPath, derivationPathToString, getEIP6963Wallets } from "@swapkit/sdk";
import type { Keystore } from "@swapkit/wallet-keystore";
import classNames from "classnames";
import { Box, Button, Checkbox, Icon, Modal, Tooltip } from "components/Atomic";
import { HoverIcon } from "components/HoverIcon";
import { InfoTip } from "components/InfoTip";
import { Input } from "components/Input";
import { DerivationPathDropdown } from "components/Modals/ConnectWalletModal/DerivationPathsDropdown";
import { isMobile } from "components/Modals/ConnectWalletModal/hooks";
import { showErrorToast } from "components/Toast";
import { useConnectWallet, useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { getFromStorage, saveInStorage } from "helpers/storage";
import useWindowSize from "hooks/useWindowSize";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { SUPPORTED_CHAINS } from "settings/chain";
import type { SupportedWalletOptions } from "store/thorswap/types";

import ChainItem from "./ChainItem";
import { ConnectKeystoreView } from "./ConnectKeystore";
import { CreateKeystoreView } from "./CreateKeystore";
import { PhraseView } from "./Phrase";
import WalletCategorySelector from "./WalletCategorySelector";
import WalletOption from "./WalletOption";
import type {
  DerivationPathType,
  HandleWalletConnectParams,
  SubCategory,
  WalletCategory,
  WalletItem,
} from "./hooks";
import { useHandleWalletConnect, useHandleWalletTypeSelect, useWalletOptions } from "./hooks";
import { WalletType, availableChainsByWallet } from "./types";

const ConnectWalletModal = () => {
  const { isMdActive } = useWindowSize();
  const { getWallet, isWalletLoading } = useWallet();
  const { unlockKeystore } = useConnectWallet();
  const { setIsConnectModalOpen, isConnectModalOpen } = useWalletConnectModal();

  const [selectedChains, setSelectedChains] = useState<Chain[]>([]);
  const [customDerivationVisible, setCustomDerivationVisible] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<WalletType>();
  const [ledgerIndex, setLedgerIndex] = useState(0);
  const [customDerivationPath, setCustomDerivationPath] = useState("m/0'/0'/0'/0/0");
  const [loading, setLoading] = useState(false);
  const [tos, setTos] = useState(false);
  const [derivationPathType, setDerivationPathType] = useState<DerivationPathType>();
  const [customFlow, setCustomFlow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WalletCategory>();
  const [saveWallet, setSaveWallet] = useState(getFromStorage("restorePreviousWallet") as boolean);

  const walletOptions = useWalletOptions({ isMdActive });

  const supportedByWallet = useMemo(
    () => availableChainsByWallet[selectedWalletType as WalletType] || SUPPORTED_CHAINS,
    [selectedWalletType],
  );

  const selectedAll = selectedChains?.length === supportedByWallet.length;

  const handleSaveStorageChange = useCallback((value: boolean) => {
    setSaveWallet(value);
    saveInStorage({ key: "restorePreviousWallet", value });
  }, []);

  // TODO (@Towan) remove when this is moved to swapkit
  const derivationPathToNumbers = (path: string): DerivationPathArray => {
    // The derivation path is expected to start with "m" followed by
    // a series of child indexes separated by slashes ("/").
    // For example: "m/44'/0'/0'/0/0"
    if (!path.startsWith("m")) {
      throw new Error('Derivation path should start with "m"');
    }

    const result = path
      // Removes the "m/" at the beginning
      .replace("m/", "")
      // Removes the "'" characters
      .replaceAll("'", "")
      // Splits the path into an array of indexes
      .split("/")
      // Parses each index into a number
      .map((part) => {
        const index = Number(part);
        if (Number.isNaN(index)) {
          throw new Error(`Invalid number in derivation path: ${part}`);
        }
        return index;
      });

    return result as DerivationPathArray;
  };

  const clearState = useCallback(
    (closeModal = true, keepSelectedChains = false) => {
      if (closeModal) setIsConnectModalOpen(false);
      setTimeout(
        () => {
          setDerivationPathType(undefined);
          setCustomFlow(false);
          setLedgerIndex(0);
          setLoading(false);
          !keepSelectedChains && setSelectedChains([]);
          setSelectedWalletType(undefined);
          setSelectedCategory(undefined);
        },
        closeModal ? 400 : 0,
      );
    },
    [setIsConnectModalOpen],
  );

  const { handleConnectWallet, addReconnectionOnAccountsChanged } = useHandleWalletConnect({
    ledgerIndex,
    chains: selectedChains,
    walletType: selectedWalletType,
    derivationPathType,
  });

  const handleAllClick = useCallback(() => {
    const nextWallets =
      (selectedWalletType &&
        [WalletType.Ledger, WalletType.Trezor, WalletType.TrustWalletExtension].includes(
          selectedWalletType,
        )) ||
      selectedAll
        ? []
        : supportedByWallet;

    setSelectedChains(nextWallets);
  }, [selectedAll, selectedWalletType, supportedByWallet]);

  const selectChain = useCallback(
    (chain: Chain, skipReset: boolean) => () => {
      if (!skipReset) setSelectedWalletType(undefined);
      setDerivationPathType(undefined);
      setLedgerIndex(0);

      setSelectedChains((prevSelectedChains) =>
        selectedWalletType &&
        [
          WalletType.Ledger,
          WalletType.MetaMask,
          WalletType.Brave,
          WalletType.Trezor,
          WalletType.TrustWalletExtension,
          WalletType.CoinbaseExtension,
        ].includes(selectedWalletType)
          ? [chain]
          : prevSelectedChains.includes(chain)
            ? prevSelectedChains.filter((c) => c !== chain)
            : [...prevSelectedChains, chain],
      );
    },
    [selectedWalletType],
  );

  const handleConnect = useCallback(
    async (keystore: Keystore, phrase: string) => {
      await unlockKeystore(keystore, phrase, selectedChains as WalletChain[]);
      clearState();
    },
    [unlockKeystore, selectedChains, clearState],
  );

  const connectWallet = useCallback(async () => {
    const keystoreOrPhrase = [
      WalletType.Keystore,
      WalletType.Phrase,
      WalletType.CreateKeystore,
    ].includes(selectedWalletType as WalletType);

    if (keystoreOrPhrase) {
      setIsConnectModalOpen(true);
      return setCustomFlow(true);
    }

    setLoading(true);

    try {
      clearState();
      await handleConnectWallet({
        derivationPath: derivationPathToNumbers(customDerivationPath),
        ledgerIndex,
        walletType: selectedWalletType,
        chains: selectedChains,
      });
      addReconnectionOnAccountsChanged();
    } catch (error) {
      logException(error as Error);
      showErrorToast(
        `${t("txManager.failed")} ${selectedWalletType}`,
        undefined,
        undefined,
        error as Error,
      );
    }
  }, [
    addReconnectionOnAccountsChanged,
    clearState,
    customDerivationPath,
    handleConnectWallet,
    ledgerIndex,
    selectedChains,
    selectedWalletType,
    setIsConnectModalOpen,
  ]);

  const handleWalletTypeSelect = useHandleWalletTypeSelect({
    setSelectedWalletType,
    setSelectedChains,
    selectedChains,
  });

  const connectedWallets = useMemo(
    () => [
      ...new Set(
        SUPPORTED_CHAINS.reduce((acc, chain) => {
          const walletType = getWallet(chain)?.walletType;
          if (walletType) acc.push(walletType.toLowerCase());
          return acc;
        }, [] as string[]),
      ),
    ],
    [getWallet],
  );

  useEffect(() => {
    const previousWallet = getFromStorage("previousWallet");
    const restorePreviousWallet = getFromStorage("restorePreviousWallet");
    if (previousWallet && restorePreviousWallet) {
      setTimeout(() => {
        handleConnectWallet(previousWallet as HandleWalletConnectParams);
      }, 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCustomDerivationPath(`${DerivationPath[selectedChains[0]]}/0`);
  }, [selectedChains]);

  const handleCustomPathSet = useCallback(async () => {
    const { getDerivationPathFor } = await import("@swapkit/sdk");

    const derivationPath = getDerivationPathFor({
      chain: selectedChains[0] || Chain.Ethereum,
      index: ledgerIndex || 0,
      type: derivationPathType,
    }) as DerivationPathArray;

    setCustomDerivationPath(derivationPathToString(derivationPath));
  }, [derivationPathType, ledgerIndex, selectedChains]);

  useEffect(() => {
    handleCustomPathSet();
  }, [handleCustomPathSet]);

  const oneTimeWalletType = [
    WalletType.CreateKeystore,
    WalletType.Keystore,
    WalletType.Phrase,
    WalletType.Ledger,
    WalletType.Trezor,
    WalletType.Walletconnect,
  ].includes(selectedWalletType || WalletType.Keystore);

  const isWalletTypeDisabled = useCallback(
    (walletType: WalletType) =>
      selectedChains.length > 0
        ? !selectedChains.every((chain) => availableChainsByWallet[walletType].includes(chain))
        : false,
    [selectedChains],
  );

  const flattenItems = (items: (WalletItem | SubCategory)[]): WalletItem[] => {
    return items.reduce<WalletItem[]>((acc, item) => {
      if ("items" in item) {
        return acc.concat(flattenItems(item.items));
      }
      return acc.concat(item);
    }, []);
  };

  const isWalletCategoryDisabled = useCallback(
    (category: WalletCategory): boolean => {
      if (selectedChains.length === 0) return false;

      const walletSection = walletOptions.find((section) => section.category === category);

      if (!walletSection) return true;

      const flattenedItems = walletSection.subCategories
        ? flattenItems(walletSection.subCategories)
        : walletSection.items || [];

      return !flattenedItems.some((item) =>
        selectedChains.every((chain) => availableChainsByWallet[item.type].includes(chain)),
      );
    },
    [selectedChains],
  );

  const walletWarning = useMemo(() => {
    switch (selectedWalletType) {
      case WalletType.Ledger:
        return {
          title: t("views.walletModal.ledgerWalletWarningTitle"),
          content: t("views.walletModal.ledgerWalletWarning"),
        };
      case WalletType.Okx:
        return selectedChains.includes(Chain.Bitcoin)
          ? {
              title: t("views.walletModal.okxWalletWarningTitle"),
              content: t("views.walletModal.okxWalletWarning"),
            }
          : undefined;
      default:
        return;
    }
  }, [selectedWalletType, selectedChains]);

  const selectedWalletSection = useMemo(() => {
    return walletOptions.find((section) => section.category === selectedCategory);
  }, [walletOptions, selectedCategory]);

  return (
    <Modal
      HeaderComponent={
        <Box className="pb-2">
          {walletWarning && (
            <InfoTip
              className="m-auto !pt-2 !pb-1 !px-2"
              content={walletWarning.content}
              contentClassName="py-0"
              title={walletWarning.title}
              type="warn"
            />
          )}
        </Box>
      }
      className="md:!max-w-[510px] -mt-24"
      isOpened={isConnectModalOpen}
      onBack={customFlow ? () => setCustomFlow(false) : undefined}
      onClose={clearState}
      title={t("views.walletModal.connectWallets")}
      withBody={false}
    >
      <Box
        col
        className={classNames(
          "bg-light-layout-primary md:!max-w-[700px] dark:bg-dark-bg-secondary rounded-3xl",
          { "!px-2 !py-4": customFlow },
        )}
        justify="between"
      >
        {customFlow ? (
          <Box className="min-w-[360px] px-6 self-center">
            {selectedWalletType === WalletType.Keystore && (
              <ConnectKeystoreView
                loading={isWalletLoading}
                onConnect={handleConnect}
                onCreate={() => setSelectedWalletType(WalletType.CreateKeystore)}
              />
            )}
            {selectedWalletType === WalletType.CreateKeystore && (
              <CreateKeystoreView
                onConnect={handleConnect}
                onKeystore={() => setSelectedWalletType(WalletType.Keystore)}
              />
            )}

            {selectedWalletType === WalletType.Phrase && <PhraseView />}
          </Box>
        ) : (
          <Box col className="md:p-2">
            <Box alignCenter col className="px-4">
              <Box alignCenter className="p-2 w-[100%] md:p-4 md:gap-4 box-content">
                <Box flex={1}>
                  <Text textStyle={isMdActive ? "h4" : "subtitle2"}>
                    {t("views.walletModal.selectChains")}
                  </Text>
                </Box>

                <Button
                  className="!h-5 !px-1.5 justify-end"
                  disabled={[
                    WalletType.Ledger,
                    WalletType.MetaMask,
                    WalletType.Brave,
                    WalletType.Trezor,
                    WalletType.TrustWalletExtension,
                    WalletType.CoinbaseExtension,
                  ].includes(selectedWalletType || WalletType.Keystore)}
                  onClick={handleAllClick}
                  size="sm"
                  textTransform="uppercase"
                  variant={selectedAll ? "primary" : "outlinePrimary"}
                >
                  <Text textStyle="caption-xs">{t("views.walletModal.selectAll")}</Text>
                </Button>
              </Box>

              <Box
                className={classNames(
                  "flex-wrap justify-center bg-light-bg-primary dark:bg-dark-bg-primary rounded-3xl z-10",
                )}
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <ChainItem
                    chain={chain}
                    isChainAvailable={availableChainsByWallet[
                      selectedWalletType as WalletType
                    ]?.includes(chain)}
                    key={chain}
                    onClick={selectChain}
                    selected={selectedChains.includes(chain)}
                    selectedWalletType={selectedWalletType}
                    walletType={getWallet(chain)?.walletType as SupportedWalletOptions}
                  />
                ))}
              </Box>
            </Box>

            <Box col>
              <Box alignCenter className="px-4">
                <Box flex={1}>
                  <Text className="md:py-4 pt-4" textStyle={isMdActive ? "h4" : "subtitle2"}>
                    {t("views.walletModal.selectWallet")}
                  </Text>
                </Box>

                <Box alignCenter className="gap-x-2">
                  {!oneTimeWalletType && (
                    <HoverIcon
                      color={saveWallet ? "cyan" : "secondary"}
                      iconName={saveWallet ? "saveFill" : "save"}
                      onClick={() => handleSaveStorageChange(!saveWallet)}
                      size={20}
                      tooltip={t("views.walletModal.keepWalletConnected")}
                    />
                  )}

                  <Button
                    className="!h-5 !px-1.5 justify-end"
                    onClick={() => clearState(false)}
                    textTransform="uppercase"
                    variant="outlinePrimary"
                  >
                    <Text textStyle="caption">{t("common.reset")}</Text>
                  </Button>
                </Box>
              </Box>

              <Box className="px-4 mb-2" col>
                {selectedWalletSection ? (
                  <Box
                    col
                    className="justify-center bg-light-bg-primary dark:bg-dark-bg-primary rounded-3xl z-10 p-4"
                  >
                    <Box>
                      <Icon
                        className="mr-2 text-light-typo-primary dark:text-dark-typo-primary"
                        name="arrowBack"
                        onClick={() => clearState(false, true)}
                      />
                      <Text fontWeight="semibold">{selectedWalletSection.title}</Text>
                    </Box>
                    <Box className="flex-wrap gap-1">
                      {selectedWalletSection.subCategories?.map((subCategory) => (
                        <Box col className="pt-2" key={subCategory.title}>
                          <Text>{subCategory.title}</Text>
                          <Box className="flex-wrap">
                            {subCategory.items.map(
                              ({ visible = true, tooltip, type, disabled, icon, id, label }) =>
                                visible && (
                                  <Tooltip content={tooltip} key={type}>
                                    <WalletOption
                                      id={id}
                                      connected={connectedWallets.includes(type.toLowerCase())}
                                      disabled={disabled || isWalletTypeDisabled(type)}
                                      handleTypeSelect={handleWalletTypeSelect}
                                      icon={icon}
                                      label={label}
                                      selected={type === selectedWalletType}
                                      type={type}
                                    />
                                  </Tooltip>
                                ),
                            )}
                          </Box>
                        </Box>
                      ))}
                      {selectedWalletSection.items?.map((item) => (
                        <Box key={item.label}>
                          {(item.visible ?? true) && (
                            <Tooltip content={item.tooltip} key={item.type}>
                              <WalletOption
                                connected={connectedWallets.includes(item.type.toLowerCase())}
                                disabled={item.disabled || isWalletTypeDisabled(item.type)}
                                handleTypeSelect={handleWalletTypeSelect}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                selected={item.type === selectedWalletType}
                                type={item.type}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <>
                    {getEIP6963Wallets().providers && (
                      <Box
                        col
                        className={classNames(
                          "px-4 py-2 flex-wrap justify-center bg-light-bg-primary dark:bg-dark-bg-primary rounded-3xl z-10",
                        )}
                      >
                        {!isMobile && (
                          <>
                            <Box className="pl-2">
                              <Text fontWeight="semibold">Instant Wallets</Text>
                            </Box>
                            <Box>
                              {getEIP6963Wallets()
                                .providers.filter((a) => a.info.name === "Passkey")
                                .map((provider) => (
                                  <WalletOption
                                    //   connected={connectedWallets.includes(item.type.toLowerCase())}
                                    handleTypeSelect={handleWalletTypeSelect}
                                    disabled={isWalletTypeDisabled(WalletType.Exodus)}
                                    key={provider.info.uuid}
                                    label={provider.info.name}
                                    type={WalletType.Exodus}
                                    icon={"add"}
                                    imgData={provider.info.icon}
                                    selected={WalletType.Exodus === selectedWalletType}
                                  />
                                ))}
                            </Box>
                          </>
                        )}
                        <Box className="pl-2">
                          <Text fontWeight="semibold">Detected Wallets</Text>
                        </Box>
                        <Box className={"flex-wrap"}>
                          {getEIP6963Wallets()
                            .providers.filter((a) => a.info.name !== "Passkey")
                            .map((provider) => {
                              const matchedWallet = walletOptions.flatMap((section) =>
                                section.items?.filter(
                                  (item) =>
                                    item.label ===
                                    (provider.info.name === "Trust Wallet"
                                      ? "Trust Browser"
                                      : provider.info.name),
                                ),
                              )[0];

                              if (matchedWallet) {
                                return (
                                  <WalletOption
                                    connected={connectedWallets.includes(
                                      matchedWallet.type.toLowerCase(),
                                    )}
                                    disabled={
                                      matchedWallet.disabled ||
                                      isWalletTypeDisabled(matchedWallet.type)
                                    }
                                    handleTypeSelect={handleWalletTypeSelect}
                                    key={matchedWallet.id}
                                    label={matchedWallet.label}
                                    type={matchedWallet.type}
                                    icon={matchedWallet.icon}
                                    selected={matchedWallet.type === selectedWalletType}
                                  />
                                );
                              }
                            })}
                        </Box>
                      </Box>
                    )}
                    {walletOptions.map(
                      ({ visible = true, title, category, icon }) =>
                        visible && (
                          <WalletCategorySelector
                            label={title}
                            id={category}
                            icon={icon}
                            category={category}
                            handleCategorySelect={setSelectedCategory}
                            disabled={isWalletCategoryDisabled(category)}
                          />
                        ),
                    )}
                  </>
                )}
              </Box>
              {selectedWalletType &&
                [WalletType.Ledger, WalletType.Trezor, WalletType.Keepkey].includes(
                  selectedWalletType,
                ) &&
                selectedChains.length === 1 && (
                  <Box center>
                    {customDerivationVisible ? (
                      <Box alignCenter className="pt-2 mx-6 gap-x-2" flex={1} justify="between">
                        <Text>{t("common.derivationPath")}:</Text>
                        <Input
                          stretch
                          border="rounded"
                          onChange={(e) => setCustomDerivationPath(e.target.value)}
                          type="text"
                          value={customDerivationPath}
                        />
                      </Box>
                    ) : (
                      <Box alignCenter className="pt-2 mx-6 gap-x-2" flex={1} justify="between">
                        <Text>{t("common.index")}:</Text>
                        <Input
                          stretch
                          border="rounded"
                          onChange={(e) => setLedgerIndex(Number.parseInt(e.target.value))}
                          type="number"
                          value={ledgerIndex}
                        />
                      </Box>
                    )}
                    <DerivationPathDropdown
                      chain={selectedChains[0]}
                      derivationPathType={derivationPathType}
                      customDerivationVisible={customDerivationVisible}
                      ledgerIndex={ledgerIndex}
                      setDerivationPathType={setDerivationPathType}
                      setCustomDerivationVisible={setCustomDerivationVisible}
                    />
                  </Box>
                )}

              <Checkbox
                className="py-1"
                label={
                  <Box alignCenter>
                    <Text>
                      {"I agree to the "}
                      <Link isExternal href="/tos">
                        Terms of Service
                      </Link>
                    </Text>
                  </Box>
                }
                onValueChange={setTos}
                value={tos}
              />

              {!customFlow && (
                <Box col className="pt-2 mb-8" flex={1} justify="end">
                  <Button
                    alignSelf="center"
                    disabled={!(tos && selectedWalletType && selectedChains.length)}
                    loading={loading}
                    onClick={connectWallet}
                    size="md"
                    variant="fancy"
                    width="66.6%"
                  >
                    <Text>{t("common.connectWallet")}</Text>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default memo(ConnectWalletModal);
