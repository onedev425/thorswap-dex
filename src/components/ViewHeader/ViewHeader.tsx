import { Box, Icon, Typography } from 'components/Atomic';
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
        <Typography className="mx-3" variant="h3">
          {title}
        </Typography>
      </Box>

      {!!actionsComponent && (
        <Box center className="pr-2">
          {actionsComponent}
        </Box>
      )}
    </Box>
  );
};
