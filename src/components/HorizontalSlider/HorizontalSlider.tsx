import 'swiper/css';

import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import type { PropsWithChildren } from 'react';
import { Children, useCallback, useEffect, useState } from 'react';
// @ts-expect-error
import SwiperCore, { Mousewheel, Navigation } from 'swiper';
// Issue related to this was closed without any notice
// https://github.com/nolimits4web/swiper/issues/5058
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Mousewheel]);

type Props = PropsWithChildren<{
  itemWidth: number | string;
  showButtons?: boolean;
}>;

export const HorizontalSlider = ({ children, itemWidth, showButtons = false }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null);
  const [navState, setNavState] = useState({ isBeginning: false, isEnd: false });

  const onSlideChange = useCallback(() => {
    setNavState({
      isBeginning: !!swiperRef?.isBeginning,
      isEnd: !!swiperRef?.isEnd,
    });
  }, [swiperRef?.isBeginning, swiperRef?.isEnd]);

  useEffect(() => {
    if (swiperRef) {
      onSlideChange();
    }
  }, [onSlideChange, swiperRef]);

  const navNext = () => {
    swiperRef?.slideNext();
  };

  const navPrev = () => {
    swiperRef?.slidePrev();
  };

  return (
    <Box center className="relative">
      {showButtons && (
        <>
          <Button
            className={classNames(
              '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 px-0 -left-[10px] mt-4 z-10 md:flex transition',
              navState.isBeginning
                ? '!opacity-0 hover:!opacity-0 pointer-events-none'
                : '!opacity-40 hover:!opacity-100 pointer-events-auto',
            )}
            disabled={navState.isBeginning}
            leftIcon={
              <Icon
                className="hover:text-btn-primary-light dark:hover:text-btn-primary"
                name="chevronLeft"
                size={40}
              />
            }
            onClick={navPrev}
            paddingInline={0}
            position="absolute"
            variant="borderlessTint"
          />
          <Button
            className={classNames(
              '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 px-0 -right-[10px] mt-4 z-10 md:flex transition',
              navState.isEnd
                ? '!opacity-0 hover:!opacity-0 pointer-events-none'
                : '!opacity-40 hover:!opacity-100 pointer-events-auto',
              !showButtons && 'hidden',
            )}
            disabled={navState.isEnd}
            leftIcon={
              <Icon
                className="hover:text-btn-primary-light dark:hover:text-btn-primary"
                name="chevronRight"
                size={40}
              />
            }
            onClick={navNext}
            paddingInline={0}
            position="absolute"
            variant="borderlessTint"
          />
        </>
      )}

      <div className="overflow-hidden faded-horizontal">
        <Swiper
          modules={[Navigation]}
          mousewheel={{ forceToAxis: true }}
          onSlideChange={onSlideChange}
          onSwiper={setSwiperRef}
          slidesPerView="auto"
        >
          {Children.map(children, (child) => (
            <SwiperSlide
              className="pt-4 flex justify-center self-center px-0.5"
              style={{ width: itemWidth }}
            >
              <Box style={{ width: itemWidth, justifyContent: 'center' }}>{child}</Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Box>
  );
};
