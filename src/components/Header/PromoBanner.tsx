import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { memo } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'settings/router';

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <Announcement
      announcement={{
        message: 'Stake $THOR to receive real-yield rewards and trading fee discounts.',
      }}
      onClick={() => navigate(ROUTES.Stake)}
      showClose={false}
      size="sm"
    />
  );
};

export default memo(PromoBanner);
