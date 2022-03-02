import { ReactNode, Children } from 'react'

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
}

export const HorizontalSlider = ({ children, itemWidth }: Props) => {
  return (
    <div className="overflow-hidden">
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
    </div>
  )
}
