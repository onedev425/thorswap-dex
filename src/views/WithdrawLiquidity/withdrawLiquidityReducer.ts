export type WithdrawLiquidityState = {
  amount: string
}

export type WithdrawLiquidityActions = {
  type: 'setAmount'
  payload: string
}

export const withdrawLiquidityReducer = (
  state: WithdrawLiquidityState,
  actions: WithdrawLiquidityActions,
): WithdrawLiquidityState => {
  switch (actions.type) {
    case 'setAmount': {
      const amount = actions.payload

      return {
        ...state,
        amount,
      }
    }

    default:
      return state
  }
}
