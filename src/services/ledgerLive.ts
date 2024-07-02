import { LedgerLive } from "../../ledgerLive/wallet/LedgerLive";

let ledgerLiveClient: LedgerLive;

// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
export const ledgerLive = () => (ledgerLiveClient ||= new LedgerLive());
