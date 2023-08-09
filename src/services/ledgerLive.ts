import { LedgerLive } from '../../ledgerLive/wallet/LedgerLive';

let ledgerLiveClient: LedgerLive;

export const ledgerLive = () => (ledgerLiveClient ||= new LedgerLive());
