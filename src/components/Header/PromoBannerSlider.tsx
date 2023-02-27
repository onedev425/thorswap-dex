import { SlideFade, Text } from '@chakra-ui/react';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { Box } from 'components/Atomic';
import { memo, ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'settings/router';

const PromoBanner = ({
  active,
  message,
  onClick,
}: {
  active: boolean;
  message: ReactNode;
  onClick: () => void;
}) => (
  <SlideFade
    className="absolute z-10 w-[95%] md:w-[500px]"
    in={active}
    offsetY={-140}
    transition={{
      enter: { duration: 0.5 },
      exit: { duration: 0.5 },
    }}
  >
    <Box center className="md:w-[500px] h-10">
      <Announcement announcement={{ message }} onClick={onClick} showClose={false} size="sm" />
    </Box>
  </SlideFade>
);

const PromoBannerSlider = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % promoItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [promoItems.length]);

  return (
    <Box className="xl:absolute">
      {promoItems.map(({ key, message, onClick }, index) => (
        <PromoBanner active={index === activeIndex} key={key} message={message} onClick={onClick} />
      ))}
    </Box>
  );
};

export default memo(PromoBannerSlider);
