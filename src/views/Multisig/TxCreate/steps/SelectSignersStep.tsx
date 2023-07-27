import { Text } from '@chakra-ui/react';
import { Box, Button, Icon } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { StepActions } from 'components/Stepper';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';
import { MultisigMember } from 'store/multisig/types';
import { useAppSelector } from 'store/store';
import { SignerCheckBox } from 'views/Multisig/components/SignerCheckBox';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

export const SelectSignersStep = () => {
  const navigate = useNavigate();
  const { signers, toggleAllSigners, toggleSigner } = useTxCreate();
  const [infoVisible, setInfoVisible] = useState(true);
  const { treshold, members } = useAppSelector(({ multisig }) => multisig);
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
        <Text fontWeight="normal" textStyle="caption">
          {t('views.multisig.selectMembesToSign')}
        </Text>

        {infoVisible && (
          <InfoTip onClose={() => setInfoVisible(false)} title="NOTE" type="warn">
            <Box className="self-stretch mx-2">
              <Text textStyle="caption" variant="yellow">
                {t('views.multisig.allMembersNeedToSignTx')}
              </Text>
            </Box>
          </InfoTip>
        )}

        <Box alignCenter flex={1} justify="between">
          <Text textStyle="caption" variant={isValid ? 'primary' : 'red'}>
            {t('views.multisig.minMembers')}: {treshold}
          </Text>

          <Button
            className="!py-1.5 !h-auto"
            onClick={toggleAllSigners}
            rightIcon={<Icon name="checkBoxes" size={18} />}
            variant="tint"
          >
            <Text textStyle="caption-xs">{t('views.multisig.selectAll')}</Text>
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
