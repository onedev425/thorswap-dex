import { ReactNode, Children } from 'react'

import classNames from 'classnames'
import SwiperCore, { Mousewheel } from 'swiper'
// Issue related to this was closed without any notice
// https://github.com/nolimits4web/swiper/issues/5058
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css'

import { Box } from 'components/Atomic'

SwiperCore.use([Mousewheel])

type Props = {
  children: ReactNode[]
  itemWidth: number
  fadeOut?: boolean
}

const fadeOutClass =
  'absolute top-0 h-full w-12 overflow-hidden from-[#f1f1f1] dark:from-dark-bg-primary z-10 pointer-events-none'

export const HorizontalSlider = ({ children, itemWidth, fadeOut }: Props) => {
  return (
    <div className="overflow-hidden relative">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        mousewheel={{
          forceToAxis: true,
        }}
      >
        {Children.map(children, (child) => (
          <SwiperSlide style={{ width: itemWidth }}>
            <Box style={{ width: itemWidth }}>{child}</Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {fadeOut && (
        <>
          <div
            className={classNames(fadeOutClass, 'left-0  bg-gradient-to-r')}
          />
          <div
            className={classNames(fadeOutClass, 'right-0  bg-gradient-to-l')}
          />
        </>
      )}
    </div>
  )
}
