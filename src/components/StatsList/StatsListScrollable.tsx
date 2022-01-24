import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'

import { Stats } from '../Stats'
import { StatsListProps } from './types'

export const StatsListScrollable = (props: StatsListProps) => {
  const { list } = props

  return (
    <div className="overflow-hidden">
      <Swiper spaceBetween={16} slidesPerView="auto">
        {list.map((item, idx) => (
          <SwiperSlide key={idx} className="!w-[185px]">
            <Stats {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
