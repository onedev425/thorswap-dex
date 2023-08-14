import { Flex, Text } from '@chakra-ui/react';
import { Icon, Tooltip } from 'components/Atomic';

type Props = {
  depth: number;
};

export const VirtualDepthInfo = ({ depth }: Props) => {
  return (
    <Tooltip content="Virtual Pool Depth - description here.">
      <Flex alignItems="center" gap={2}>
        <Flex background={getColor(depth)} borderRadius="100%" h="12px" w="12px" />
        <Text textStyle="caption">VPD: {depth}</Text>
        <Icon color="secondary" name="infoCircle" size={16} />
      </Flex>
    </Tooltip>
  );
};

function getColor(depth: number) {
  if (depth > 79) {
    return 'brand.green';
  } else if (depth > 50) {
    return 'brand.yellow';
  } else {
    return 'brand.red';
  }
}
