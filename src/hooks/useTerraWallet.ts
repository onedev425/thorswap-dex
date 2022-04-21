import {
  useWallet,
  WalletStatus,
  ConnectType,
  useConnectedWallet,
} from '@terra-money/wallet-provider'

export const TERRA_STATION_ICON =
  'https://assets.terra.money/icon/station-extension/icon.png'

export const useTerraWallet = () => {
  const {
    status,
    wallets: terraWallets,
    network: TerraNetwork,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    // TODO: Rewrite to `availableInstallations` https://github.com/terra-money/wallet-provider/blob/4e601c2dece7bec92c9ce95991d2314220a2c954/packages/src/%40terra-money/use-wallet/useWallet.ts#L122-L126
    install,
    disconnect,
  } = useWallet()

  const connectedWallet = useConnectedWallet()

  const isTerraWalletConnected = status === WalletStatus.WALLET_CONNECTED

  const isTerraStationInstalled = availableConnectTypes.includes(
    ConnectType.EXTENSION,
  )
  const isTerraStationAvailable =
    isTerraStationInstalled ||
    availableInstallTypes.includes(ConnectType.EXTENSION)

  const isTerraWalletConnectAvailable = availableConnectTypes.includes(
    ConnectType.WALLETCONNECT,
  )

  return {
    connectedWallet,
    TerraNetwork,
    terraWallets,
    isTerraWalletConnected,
    isTerraStationAvailable,
    isTerraStationInstalled,
    isTerraWalletConnectAvailable,
    TerraConnectType: ConnectType,
    connectTerraWallet: connect,
    disconnectTerraWallet: disconnect,
    installTerraWallet: install,
  }
}
