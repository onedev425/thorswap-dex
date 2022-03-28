export enum NodeStatus {
  Active = 'Active',
  Standby = 'Standby',
  Whitelisted = 'Whitelisted',
}

export enum NodeAction {
  BOND = 'BOND',
  UNBOND = 'UNBOND',
  LEAVE = 'LEAVE',
}

export const nodeStatusOptions = [
  NodeStatus.Active,
  NodeStatus.Standby,
  NodeStatus.Whitelisted,
]
