import { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router'

import { SupportedChain } from '@thorswap-lib/types'
import { Chain } from '@thorswap-lib/xchain-util'

import { CurrentSignersModal } from 'views/Multisig/components/CurrentSignersModal'
import { ImportSignatureModal } from 'views/Multisig/components/ImportSignatureModal'
import { useMultisigWalletInfo } from 'views/Multisig/hooks'
import { ScreenState, useTxData } from 'views/Multisig/TxMultisig/hooks'

import { Box, Button, Icon, Link, Typography, Tooltip } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { InfoTable } from 'components/InfoTable'
import { InfoTip } from 'components/InfoTip'
import { PanelTextarea } from 'components/PanelTextarea'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { ROUTES } from 'settings/constants'

const TxMultisig = () => {
  const info = useMultisigWalletInfo()
  const { state } = useLocation()
  const navigate = useNavigate()
  const {
    signature,
    signers,
    addSigner,
    canBroadcast,
    handleSign,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
  } = useTxData(state as ScreenState | null)
  const { treshold } = useAppSelector((state) => state.multisig)
  const [isImportModalOpened, setIsImportModalOpened] = useState(false)
  const [isSignersModalOpened, setIsSignersModalOpened] = useState(false)
  const txUrl = broadcastedTxHash
    ? multichain.getExplorerTxUrl(
        Chain.THORChain as SupportedChain,
        broadcastedTxHash,
      )
    : ''

  useEffect(() => {
    if (!state) {
      navigate(ROUTES.TxImport)
    }
  })

  return (
    <PanelView
      title={t('views.multisig.multisigTransaction')}
      header={<ViewHeader title={t('views.multisig.multisigTransaction')} />}
    >
      <InfoTip
        type={broadcastedTxHash ? 'success' : 'info'}
        content={
          broadcastedTxHash ? (
            <Box>
              {t('views.multisig.txBroadcasted')}
              <Link to={txUrl}>
                <Box center>
                  <Typography
                    className="underline ml-1.5"
                    color="green"
                    variant="caption"
                    fontWeight="bold"
                  >
                    {t('views.multisig.viewTx')}
                  </Typography>
                  <Icon name="external" color="green" size={14} />
                </Box>
              </Link>
            </Box>
          ) : (
            t('views.multisig.inProgressTx')
          )
        }
      />

      <Box className="w-full gap-1 my-4 pt-2" col>
        <InfoTable items={[info[0]]} horizontalInset />

        <Box className="mt-4" flex={1} col>
          <PanelTextarea
            className="flex-1 min-h-[100px]"
            disabled
            value={signature}
          />

          <Box className="mt-6" col>
            <FieldLabel label={t('views.multisig.signatures')} />
            <Typography
              className="mx-2"
              variant="caption"
              fontWeight="normal"
              color="secondary"
            >
              {t('views.multisig.txSignaturesInfo')}
            </Typography>
          </Box>
          <Tooltip content={t('views.multisig.viewCurrentSigners')} place="top">
            <Box
              className="mt-2 cursor-pointer"
              flex={1}
              onClick={() => setIsSignersModalOpened(true)}
            >
              <InfoTip className="flex-1" type="primary">
                <Box
                  className="gap-1 self-stretch w-full"
                  justify="between"
                  alignCenter
                  flex={1}
                >
                  <Box className="w-[30px]" />
                  <Box className="gap-1" align="end">
                    <Typography variant="subtitle1">
                      {signers.length}
                    </Typography>
                    <Typography variant="body">of</Typography>
                    <Typography variant="subtitle1">{treshold}</Typography>
                    <Typography variant="body">signatures complete</Typography>
                  </Box>
                  <Icon className="p-1" name="eye" size={26} />
                </Box>
              </InfoTip>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Box center className="w-full pt-5 gap-5" col>
        <Box className="gap-2 self-stretch" flex={1}>
          <Button variant="primary" stretch onClick={handleSign}>
            {t('views.multisig.signTx')}
          </Button>
          <Button
            variant="secondary"
            stretch
            onClick={() => setIsImportModalOpened(true)}
          >
            {t('views.multisig.importSignature')}
          </Button>
        </Box>

        <Button
          variant="primary"
          stretch
          size="lg"
          isFancy
          error={!canBroadcast}
          disabled={!canBroadcast}
          onClick={handleBroadcast}
          loading={isBroadcasting}
        >
          {t('views.multisig.broadcast')}
        </Button>
      </Box>

      <ImportSignatureModal
        isOpened={isImportModalOpened}
        onClose={() => setIsImportModalOpened(false)}
        onSubmit={(signature) => {
          setIsImportModalOpened(false)
          addSigner(signature)
        }}
      />

      <CurrentSignersModal
        isOpened={isSignersModalOpened}
        onClose={() => setIsSignersModalOpened(false)}
        signers={signers}
      />
    </PanelView>
  )
}

export default TxMultisig
