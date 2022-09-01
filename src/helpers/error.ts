const ORIGIN_UTXO_ERROR_MSG = 'No utxos to send';
const PROCESSED_UTXO_ERROR_MSG = 'Please wait a bit until 3 UTXO confirmations and Try again.';

export const translateErrorMsg = (msg: string) => {
  if (msg.includes(ORIGIN_UTXO_ERROR_MSG)) {
    return PROCESSED_UTXO_ERROR_MSG;
  }

  return msg;
};
