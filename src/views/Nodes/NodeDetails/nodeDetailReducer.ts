export type AddLiquidityState = {
  amount: string;
  favorite: boolean;
  actionIndex: number;
};

export type NodeDetailActions =
  | { type: "setAmount"; payload: string }
  | {
      type: "setFavorite";
      payload: boolean;
    }
  | {
      type: "setActionIndex";
      payload: number;
    };

export const nodeDetailReducer = (
  state: AddLiquidityState,
  actions: NodeDetailActions,
): AddLiquidityState => {
  switch (actions.type) {
    case "setAmount":
      return {
        ...state,
        amount: actions.payload,
      };

    case "setFavorite": {
      return {
        ...state,
        favorite: actions.payload,
      };
    }
    case "setActionIndex": {
      return {
        ...state,
        actionIndex: actions.payload,
      };
    }

    default:
      return state;
  }
};
