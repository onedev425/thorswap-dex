export enum NodeStatus {
  Active = 'Active',
  Standby = 'Standby',
  Whitelisted = 'Whitelisted',
}

export const nodeStatusOptions = [
  NodeStatus.Active,
  NodeStatus.Standby,
  NodeStatus.Whitelisted,
]

export enum BondActionType {
  Bond = 'bond',
  Unbond = 'unbond',
  Leave = 'leave',
}
