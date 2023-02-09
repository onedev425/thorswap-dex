import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Icon, Tooltip } from 'components/Atomic';
import { genericBgClasses, lightInputBorder } from 'components/constants';
import { HighlightCard } from 'components/HighlightCard';
import { StepActions } from 'components/Stepper';
import { useAddressUtils } from 'hooks/useAddressUtils';
import { t } from 'services/i18n';
import { useAppSelector } from 'store/store';
import { MultisigExport } from 'views/Multisig/components/MultisigExport/MultisigExport';

export const ExportWalletStep = () => {
  const { address } = useAppSelector((state) => state.multisig);
  const { handleCopyAddress } = useAddressUtils(address);

  return (
    <Box col className="gap-5">
      <Box col className="gap-3">
        <Text fontWeight="normal" textStyle="caption">
          {`${t('views.multisig.createdWalletAddress')}:`}
        </Text>
        <Tooltip className="flex flex-1" content={t('common.copy')}>
          <Box center className="gap-2 cursor-pointer" flex={1} onClick={handleCopyAddress}>
            <HighlightCard
              className={classNames(
                genericBgClasses.primary,
                '!px-2 !py-3 truncate overflow-hidden flex-1 !border-opacity-20 hover:!border-opacity-100',
                lightInputBorder,
              )}
            >
              <Box justify="between">
                <Text
                  className="break-all whitespace-normal"
                  textStyle="caption"
                  variant="secondary"
                >
                  {address}
                </Text>
                <div>
                  <Icon className="px-2" name="copy" size={16} />
                </div>
              </Box>
            </HighlightCard>
          </Box>
        </Tooltip>
      </Box>

      <Box className="gap-2">
        <Text textStyle="caption">{t('views.multisig.exportWalletInfoToFile')}</Text>
        <MultisigExport />
      </Box>

      <StepActions />
    </Box>
  );
};
