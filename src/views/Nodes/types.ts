import { Amount } from '@thorswap-lib/multichain-sdk';

export enum NodeStatus {
  Active = 'Active',
  Standby = 'Standby',
  Whitelisted = 'Whitelisted',
}

export const nodeStatusOptions = [NodeStatus.Active, NodeStatus.Standby, NodeStatus.Whitelisted];

export enum BondActionType {
  Bond = 'bond',
  Unbond = 'unbond',
  Leave = 'leave',
}

export type BondActionParams = {
  type: BondActionType;
  nodeAddress: string;
  amount?: Amount;
};

export type HandleBondAction = (params: BondActionParams) => void;

export type NodeManagePanelProps = {
  address?: string;
  handleBondAction?: HandleBondAction;
  skipWalletCheck?: boolean;
};
