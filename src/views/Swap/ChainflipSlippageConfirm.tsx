import { Text } from '@chakra-ui/react';
import { Box, Checkbox } from 'components/Atomic';
import { useEffect } from 'react';
import { t } from 'services/i18n';
import { useLocalStorage } from 'usehooks-ts';

type Props = {
  onConfirmChange: (value: boolean) => void;
};

export const ChainflipSlippageConfirm = ({ onConfirmChange }: Props) => {
  const [chainflipSlippageConfirmed, setChainflipSlippageConfirmed] = useLocalStorage(
    'chainflipSlippageConfirmed',
    false,
  );

  useEffect(() => {
    onConfirmChange(chainflipSlippageConfirmed);
  }, [chainflipSlippageConfirmed, onConfirmChange]);

  return (
    <Checkbox
      className="pt-4 pb-2"
      label={
        <Box alignCenter>
          <Text textStyle="caption-xs">{t('views.swap.chainflipSlippageWarning')}</Text>
        </Box>
      }
      onValueChange={setChainflipSlippageConfirmed}
      value={chainflipSlippageConfirmed}
    />
  );
};
