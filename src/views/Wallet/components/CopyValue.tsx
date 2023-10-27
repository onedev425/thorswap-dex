import { Text } from '@chakra-ui/react';
import { Box, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import { useCopyUtils } from 'hooks/useCopyUtils';
import { t } from 'services/i18n';

type Props = {
  type: 'short' | 'mini' | 'icon' | 'full';
  value: string;
};

export const CopyValue = ({ type = 'icon', value }: Props) => {
  const { handleCopyValue } = useCopyUtils(value);

  if (type === 'icon') {
    return (
      <HoverIcon
        iconName="copy"
        onClick={handleCopyValue}
        size={16}
        tooltip={t('common.copy')}
      />
    );
  }

  return (
    <Tooltip content={t('common.copy')}>
      <Box onClick={handleCopyValue}>
        <Text className={baseHoverClass} fontWeight="semibold" textStyle="caption">
          {value}
        </Text>
      </Box>
    </Tooltip>
  );
};
