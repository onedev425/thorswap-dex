import { SlideFade, Text } from '@chakra-ui/react';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { Box } from 'components/Atomic';
import { memo, ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'settings/router';
import { useEggAvailableQuery } from 'store/swapKitDashboard/api';

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
  const { data: isEasterEggAvailable } = useEggAvailableQuery();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const promoItems = useMemo(
    () => [
      ...(isEasterEggAvailable
        ? [
            {
              key: 'promo-2',
              message: (
                <Text textStyle="caption-xs">
                  Easter is here 🥚! Find hidden eggs 🐣 and claim $THOR rewards!{' '}
                  <Text className="inline px-0.5" decoration="underline" textStyle="caption-xs">
                    Learn more
                  </Text>
                </Text>
              ),
              onClick: () => alert('TODO REDIRECT'),
            },
          ]
        : []),
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
    ],
    [isEasterEggAvailable, navigate],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % promoItems.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [promoItems.length]);

  return (
    <Box className="justify-center xl:justify-start xl:absolute" flex={1}>
      {promoItems.map(({ key, message, onClick }, index) => (
        <PromoBanner active={index === activeIndex} key={key} message={message} onClick={onClick} />
      ))}
    </Box>
  );
};

export default memo(PromoBannerSlider);
