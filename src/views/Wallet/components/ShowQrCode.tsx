import type { Chain } from "@swapkit/sdk";
import { Box } from "components/Atomic";
import { HoverIcon } from "components/HoverIcon";
import { QRCodeModal } from "components/Modals/QRCodeModal";
import { chainName } from "helpers/chainName";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { t } from "services/i18n";

type Props = {
  chain: Chain;
  address: string;
  openComponent?: ReactNode;
};

type QrCodeData = {
  chain: string;
  address: string;
};

const EMPTY_QR_DATA = { chain: "", address: "" };

export const ShowQrCode = ({ chain, address, openComponent }: Props) => {
  const [qrData, setQrData] = useState<QrCodeData>(EMPTY_QR_DATA);

  const handleViewQRCode = useCallback(() => {
    if (address) {
      setQrData({
        chain: chainName(chain, true),
        address,
      });
    }
  }, [chain, address]);

  return (
    <>
      {openComponent ? (
        <Box onClick={handleViewQRCode}>{openComponent}</Box>
      ) : (
        <HoverIcon
          iconName="qrcode"
          onClick={handleViewQRCode}
          size={16}
          tooltip={address ? t("views.wallet.showQRCode") : t("views.walletModal.notConnected")}
        />
      )}

      <QRCodeModal
        address={qrData.address}
        chain={qrData.chain}
        onCancel={() => setQrData(EMPTY_QR_DATA)}
      />
    </>
  );
};
