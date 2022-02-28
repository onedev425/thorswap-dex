import { ReactNode, Children } from 'react'

import SwiperCore, { Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'

import { Box } from 'components/Atomic'

SwiperCore.use([Mousewheel])

type Props = {
  children: ReactNode[]
  itemWidth: number
}

export const HorizontalSlider = ({ children, itemWidth }: Props) => {
  return (
    <div className="overflow-hidden">
      <Swiper spaceBetween={16} slidesPerView="auto" mousewheel>
        {Children.map(children, (child) => (
          <SwiperSlide style={{ width: itemWidth }}>
            <Box style={{ width: itemWidth }}>{child}</Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
