import { ReactNode, Children, useState, useEffect, useCallback } from 'react'

import classNames from 'classnames'
import SwiperCore, { Mousewheel, Navigation } from 'swiper'
// Issue related to this was closed without any notice
// https://github.com/nolimits4web/swiper/issues/5058
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css'

import { Box, Button, Icon } from 'components/Atomic'

SwiperCore.use([Mousewheel])

type Props = {
  children: ReactNode[]
  itemWidth: number
}

export const HorizontalSlider = ({ children, itemWidth }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null)
  const [navState, setNavState] = useState({ isBeginning: false, isEnd: false })

  const onSlideChange = useCallback(() => {
    setNavState({
      isBeginning: !!swiperRef?.isBeginning,
      isEnd: !!swiperRef?.isEnd,
    })
  }, [swiperRef?.isBeginning, swiperRef?.isEnd])

  useEffect(() => {
    if (swiperRef) {
      onSlideChange()
    }
  }, [onSlideChange, swiperRef])

  const navNext = () => {
    swiperRef?.slideNext()
  }

  const navPrev = () => {
    swiperRef?.slidePrev()
  }

  return (
    <div className="relative align-center">
      <Button
        className={classNames(
          '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 absolute px-0 -left-[10px] z-10 top-[50%] translate-y-[-50%] hidden md:flex transition',
          navState.isBeginning
            ? '!opacity-0 hover:!opacity-0 pointer-events-none'
            : '!opacity-40 hover:!opacity-100 pointer-events-auto',
        )}
        type="borderless"
        variant="tint"
        startIcon={
          <Icon
            className="hover:text-btn-primary-light dark:hover:text-btn-primary"
            name="chevronLeft"
            size={40}
          />
        }
        disabled={navState.isBeginning}
        onClick={navPrev}
      />
      <Button
        className={classNames(
          '!bg-opacity-0 hover:!bg-opacity-0 dark:hover:!bg-opacity-0 absolute px-0 -right-[10px] z-10 top-[50%] translate-y-[-50%] hidden md:flex transition',
          navState.isEnd
            ? '!opacity-0 hover:!opacity-0 pointer-events-none'
            : '!opacity-40 hover:!opacity-100 pointer-events-auto',
        )}
        type="borderless"
        variant="tint"
        startIcon={
          <Icon
            className="hover:text-btn-primary-light dark:hover:text-btn-primary"
            name="chevronRight"
            size={40}
          />
        }
        disabled={navState.isEnd}
        onClick={navNext}
      />
      <div className="overflow-hidden lg:mx-[16px] faded-horizontal relative">
        <Swiper
          onSwiper={setSwiperRef}
          spaceBetween={16}
          slidesPerView="auto"
          mousewheel={{ forceToAxis: true }}
          slidesOffsetAfter={16}
          slidesOffsetBefore={16}
          modules={[Navigation]}
          onSlideChange={onSlideChange}
        >
          {Children.map(children, (child) => (
            <SwiperSlide className="py-8" style={{ width: itemWidth }}>
              <Box style={{ width: itemWidth }}>{child}</Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
