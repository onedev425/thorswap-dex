import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'

import { Stats } from 'components/Stats'
import { statsWidthClass } from 'components/Stats/types'

import { StatsListProps } from './types'

export const StatsListScrollable = (props: StatsListProps) => {
  const { list } = props

  return (
    <div className="overflow-hidden">
      <Swiper spaceBetween={16} slidesPerView="auto">
        {list.map((item) => (
          <SwiperSlide key={item.value} className={statsWidthClass}>
            <Stats {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
