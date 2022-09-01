import { Box, Button, Icon, Typography } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { StepActions } from 'components/Stepper';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/constants';
import { MultisigMember } from 'store/multisig/types';
import { useAppSelector } from 'store/store';
import { SignerCheckBox } from 'views/Multisig/components/SignerCheckBox';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

export const SelectSignersStep = () => {
  const navigate = useNavigate();
  const { signers, toggleAllSigners, toggleSigner } = useTxCreate();
  const [infoVisible, setInfoVisible] = useState(true);
  const { treshold, members } = useAppSelector((state) => state.multisig);
  const isValid = signers?.length >= treshold;

  const isSelected = useCallback(
    (memeber: MultisigMember) => {
      return !!signers.find((m) => m.pubKey === memeber.pubKey);
    },
    [signers],
  );

  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-3" flex={1}>
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.selectMembesToSign')}
        </Typography>

        {infoVisible && (
          <InfoTip onClose={() => setInfoVisible(false)} title="NOTE" type="warn">
            <Box className="self-stretch mx-2">
              <Typography color="yellow" variant="caption">
                {t('views.multisig.allMembersNeedToSignTx')}
              </Typography>
            </Box>
          </InfoTip>
        )}

        <Box alignCenter flex={1} justify="between">
          <Typography color={isValid ? 'primary' : 'red'} variant="caption">
            {t('views.multisig.minMembers')}: {treshold}
          </Typography>

          <Button
            className="!py-1.5 !h-auto"
            endIcon={<Icon name="checkBoxes" size={18} />}
            onClick={toggleAllSigners}
            variant="tint"
          >
            <Typography variant="caption-xs">{t('views.multisig.selectAll')}</Typography>
          </Button>
        </Box>

        <Box col className="gap-1" flex={1}>
          {members.map((m) => (
            <SignerCheckBox
              isSelected={isSelected(m)}
              key={m.pubKey}
              onClick={toggleSigner}
              signer={m}
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
  );
};
