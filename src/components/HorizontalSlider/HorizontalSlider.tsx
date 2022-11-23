import 'swiper/css';

import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { Children, PropsWithChildren, useCallback, useEffect, useState } from 'react';
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
    <div className="relative align-center">
      <Button
        className={classNames(
          '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 absolute px-0 -left-[10px] z-10 top-[50%] translate-y-[-50%] md:flex transition',
          navState.isBeginning
            ? '!opacity-0 hover:!opacity-0 pointer-events-none'
            : '!opacity-40 hover:!opacity-100 pointer-events-auto',
          !showButtons && 'hidden',
        )}
        disabled={navState.isBeginning}
        onClick={navPrev}
        startIcon={
          <Icon
            className="hover:text-btn-primary-light dark:hover:text-btn-primary"
            name="chevronLeft"
            size={40}
          />
        }
        type="borderless"
        variant="tint"
      />
      <Button
        className={classNames(
          '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 absolute px-0 -right-[10px] z-10 top-[50%] translate-y-[-50%] md:flex transition',
          navState.isEnd
            ? '!opacity-0 hover:!opacity-0 pointer-events-none'
            : '!opacity-40 hover:!opacity-100 pointer-events-auto',
          !showButtons && 'hidden',
        )}
        disabled={navState.isEnd}
        onClick={navNext}
        startIcon={
          <Icon
            className="hover:text-btn-primary-light dark:hover:text-btn-primary"
            name="chevronRight"
            size={40}
          />
        }
        type="borderless"
        variant="tint"
      />
      <div className="overflow-hidden lg:mx-[16px] faded-horizontal relative">
        <Swiper
          modules={[Navigation]}
          mousewheel={{ forceToAxis: true }}
          onSlideChange={onSlideChange}
          onSwiper={setSwiperRef}
          slidesOffsetAfter={16}
          slidesOffsetBefore={16}
          slidesPerView="auto"
          spaceBetween={16}
        >
          {Children.map(children, (child) => (
            <SwiperSlide
              className="py-8 flex justify-center self-center px-0.5"
              style={{ width: itemWidth }}
            >
              <Box style={{ width: itemWidth, justifyContent: 'center' }}>{child}</Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
