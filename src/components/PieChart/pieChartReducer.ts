type Actions =
  | { type: 'setIndex'; payload: number }
  | {
      type: 'setChartData'
      payload: {
        values: number[]
        bgColors: string[]
        bgHoverColors: string[]
      }
    }

const initialState = {
  values: [] as number[],
  bgColors: [] as string[],
  bgHoverColors: [] as string[],
  index: -1,
}

export const pieChartReducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case 'setChartData':
      return { ...state, ...action.payload }

    case 'setIndex':
      return { ...state, index: action.payload }

    default:
      return state
  }
}
