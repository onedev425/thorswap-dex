export type ConnectKeyStoreProps = {
  fileName: undefined | string
  password: string
  isOpened: boolean
  onClose: () => void
  onPasswordChange: (event: React.ChangeEvent) => void
  onFileUpload: (event: React.ChangeEvent) => void
  onUnlock: () => void
  onCreateWallet: () => void
}
