import { Text } from '@chakra-ui/react';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'settings/router';
import { Autoplay, Navigation } from 'swiper';
// Issue related to this was closed without any notice
// https://github.com/nolimits4web/swiper/issues/5058
import { Swiper, SwiperSlide } from 'swiper/react';

const PromoBanner = () => {
  const navigate = useNavigate();

  const promoItems = useMemo(
    () => [
      {
        key: 'promo-1',
        message: (
          <Text textStyle="caption-xs">
            Stake
            <Text className="inline px-0.5" decoration="underline" textStyle="caption-xs">
              $THOR
            </Text>
            to receive real-yield rewards and trading fee discounts.
          </Text>
        ),
        onClick: () => navigate(ROUTES.Stake),
      },
      {
        key: 'promo-2',
        message: (
          <Text textStyle="caption-xs">
            Stake
            <Text className="inline px-0.5" decoration="underline" textStyle="caption-xs">
              $THOR
            </Text>
            to receive real-yield rewards and trading fee discounts.
          </Text>
        ),
        onClick: () => navigate(ROUTES.Stake),
      },
    ],
    [navigate],
  );

  return (
    <Swiper
      autoplay={{ delay: 3000, pauseOnMouseEnter: true, disableOnInteraction: false }}
      modules={[Autoplay, Navigation]}
      mousewheel={{ forceToAxis: true }}
      slidesPerView="auto"
    >
      {promoItems.map(({ key, message, onClick }) => (
        <SwiperSlide className="flex justify-center" key={key}>
          <Announcement announcement={{ message }} onClick={onClick} showClose={false} size="sm" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default memo(PromoBanner);
