import { Card, Flex, Text } from '@chakra-ui/react';
import { Icon, Tooltip } from 'components/Atomic';

type Props = {
  header: string;
  value: string;
  tooltipText: string;
};

export const LoanInfoCard = ({ header, value, tooltipText }: Props) => {
  return (
    <Card flex={1} gap={4} height="full" px={4} variant="filledContainerSecondary">
      <Flex justify="space-between" w="full">
        <Text textStyle="subtitle1">{header}</Text>
        {tooltipText && (
          <Tooltip content={tooltipText} place="bottom">
            <Icon color="primaryBtn" name="infoCircle" size={24} />
          </Tooltip>
        )}
      </Flex>
      <Text textStyle="h2">{value}</Text>
    </Card>
  );
};
