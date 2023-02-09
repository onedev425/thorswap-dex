import { Text } from '@chakra-ui/react';
import { Box, Icon } from 'components/Atomic';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  withBack?: boolean;
  actionsComponent?: ReactNode;
};

export const ViewHeader = ({ title, withBack, actionsComponent }: Props) => {
  const navigate = useNavigate();

  return (
    <Box alignCenter justify="between">
      <Box alignCenter>
        {withBack && (
          <Icon className="" color="secondary" name="arrowBack" onClick={() => navigate(-1)} />
        )}
        <Text className="mx-3" textStyle="h3">
          {title}
        </Text>
      </Box>

      {!!actionsComponent && (
        <Box center className="pr-2">
          {actionsComponent}
        </Box>
      )}
    </Box>
  );
};
