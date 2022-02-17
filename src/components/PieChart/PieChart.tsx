import { useReducer, useEffect, useCallback, useRef } from 'react'

import { Doughnut } from 'react-chartjs-2'

import { ChartData, ScriptableContext } from 'chart.js'
import classNames from 'classnames'

import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { pieChartReducer } from './pieChartReducer'
import { PieChartProps } from './types'

const options = {
  responsive: true,
  plugins: {
    tooltip: { enabled: false },
    legend: { display: false },
  },
}

const staticDataSetValues = {
  label: 'Wallet',
  hoverOffset: 0,
  borderWidth: 0,
  cutout: '76%',
  borderRadius: 360,
}

export const PieChart = ({ data }: PieChartProps) => {
  const initialised = useRef(false)
  const [{ values, bgColors, bgHoverColors, index }, dispatch] = useReducer(
    pieChartReducer,
    data.reduce(
      (acc, { value, backgroundColor, hoverBackgroundColor }) => {
        acc.values.push(value)
        acc.bgColors.push(backgroundColor)
        acc.bgHoverColors.push(hoverBackgroundColor)
        return acc
      },
      {
        index: -1,
        values: [] as number[],
        bgColors: [] as string[],
        bgHoverColors: [] as string[],
      },
    ),
  )

  const hoverBorderWidth = useCallback(
    ({ dataIndex }: ScriptableContext<'doughnut'>) => {
      dispatch({ type: 'setIndex', payload: dataIndex })
      return undefined
    },
    [],
  )

  useEffect(() => {
    if (initialised.current) {
      const payload = data.reduce(
        (acc, { value, backgroundColor, hoverBackgroundColor }) => {
          acc.values.push(value)
          acc.bgColors.push(backgroundColor)
          acc.bgHoverColors.push(hoverBackgroundColor)
          return acc
        },
        {
          index: -1,
          values: [] as number[],
          bgColors: [] as string[],
          bgHoverColors: [] as string[],
        },
      )
      dispatch({ type: 'setChartData', payload })
    } else {
      initialised.current = true
    }
  }, [data])

  const state: ChartData<'doughnut', number[]> = {
    labels: [],
    datasets: [
      {
        ...staticDataSetValues,
        backgroundColor: bgColors,
        hoverBackgroundColor: bgHoverColors,
        data: values,
        hoverBorderWidth,
      },
    ],
  }
  const isIndexValid = index >= 0
  const bgColor = isIndexValid ? data[index].themeBg : 'bg-yellow'
  const commonClasses = `rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-colors ${bgColor}`

  return (
    <div className="rounded-full inline-flex justify-center items-center relative w-[220px] h-[220px]">
      <div className={classNames(commonClasses, 'opacity-[0.08] w-40 h-40')} />
      <div className={classNames(commonClasses, 'opacity-[0.08] w-32 h-32')} />
      <div
        className={classNames(commonClasses, 'opacity-40 w-24 h-24', bgColor)}
      />
      <div
        className={classNames(
          commonClasses,
          'opacity-75 w-16 h-16 brightness-[0.20]',
        )}
      />

      <div className="w-16 h-16 flex justify-center items-center flex-col relative">
        <Icon
          name={isIndexValid ? data[index].iconName : 'smile'}
          color={isIndexValid ? data[index].iconColor : 'yellow'}
          size={20}
          className="mb-1 relative"
        />
        <Typography
          variant="caption-xs"
          fontWeight="bold"
          className="text-center align-middle"
        >
          {isIndexValid ? data[index].value : '100'}
        </Typography>
      </div>

      <Doughnut
        onMouseLeave={() => dispatch({ type: 'setIndex', payload: -1 })}
        data={state}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
        options={options}
      />
    </div>
  )
}
