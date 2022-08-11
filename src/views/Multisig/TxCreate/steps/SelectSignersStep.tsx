import { useCallback, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { SignerCheckBox } from 'views/Multisig/components/SignerCheckBox'
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'
import { StepActions } from 'components/Stepper'

import { MultisigMember } from 'store/multisig/types'
import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const SelectSignersStep = () => {
  const navigate = useNavigate()
  const { signers, toggleAllSigners, toggleSigner } = useTxCreate()
  const [infoVisible, setInfoVisible] = useState(true)
  const { treshold, members } = useAppSelector((state) => state.multisig)
  const isValid = signers?.length >= treshold

  const isSelected = useCallback(
    (memeber: MultisigMember) => {
      return !!signers.find((m) => m.pubKey === memeber.pubKey)
    },
    [signers],
  )

  return (
    <Box className="self-stretch mx-2" col flex={1}>
      <Box className="gap-3" col flex={1}>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.selectMembesToSign')}
        </Typography>

        {infoVisible && (
          <InfoTip
            type="warn"
            title="NOTE"
            onClose={() => setInfoVisible(false)}
          >
            <Box className="self-stretch mx-2">
              <Typography variant="caption" color="yellow">
                {t('views.multisig.allMembersNeedToSignTx')}
              </Typography>
            </Box>
          </InfoTip>
        )}

        <Box flex={1} justify="between" alignCenter>
          <Typography variant="caption" color={isValid ? 'primary' : 'red'}>
            {t('views.multisig.minMembers')}: {treshold}
          </Typography>

          <Button
            className="!py-1.5 !h-auto"
            variant="tint"
            endIcon={<Icon name="checkBoxes" size={18} />}
            onClick={toggleAllSigners}
          >
            <Typography variant="caption-xs">
              {t('views.multisig.selectAll')}
            </Typography>
          </Button>
        </Box>

        <Box className="gap-1" col flex={1}>
          {members.map((m) => (
            <SignerCheckBox
              key={m.pubKey}
              signer={m}
              onClick={toggleSigner}
              isSelected={isSelected(m)}
            />
          ))}
        </Box>
      </Box>

      <StepActions
        backAction={() => navigate(ROUTES.TxBuilder)}
        backLabel={t('common.cancel')}
        nextDisabled={!isValid}
      />
    </Box>
  )
}
