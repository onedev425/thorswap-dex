/* eslint-disable prettier/prettier */
import { ColorModeScript } from "@chakra-ui/react";
import * as Sentry from "@sentry/react";
import { WalletProvider } from "@swapkit/wallet-exodus";
import hmacSHA512 from "crypto-js/hmac-sha512";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { App, exodusWallet } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initialiseLogger } from "./services/logger";
import { IS_LOCAL, IS_PROD, IS_STAGENET } from "./settings/config";

import { isMobile } from "components/Modals/ConnectWalletModal/hooks";

const container = document.getElementById("root");
const root = createRoot(container);

const renderApp = () => {
  initialiseLogger();

  root.render(
    isMobile ? (
      <StrictMode>
        <Sentry.ErrorBoundary fallback={(error) => <ErrorBoundary error={error} />}>
          <ColorModeScript />
          <App />
        </Sentry.ErrorBoundary>
      </StrictMode>
    ) : (
      <WalletProvider wallet={exodusWallet}>
        <StrictMode>
          <Sentry.ErrorBoundary fallback={(error) => <ErrorBoundary error={error} />}>
            <ColorModeScript />
            <App />
          </Sentry.ErrorBoundary>
        </StrictMode>
      </WalletProvider>
    ),
  );
};

const checkAppRender = () => {
  if (IS_LOCAL || IS_STAGENET || IS_PROD) {
    renderApp();
  } else {
    const pagePassword =
      localStorage.getItem("pagePassword") ||
      prompt("Please enter the password to access this page");
    localStorage.setItem("pagePassword", pagePassword);

    const decodedPass = hmacSHA512(pagePassword, "I!(G#s@1ADgjAlcSW!@()GF#(!@")
      .toString()
      .slice(-10);

    /**
     * Replace with new password hash generated from command line.
     */
    const currentPasswordHash = "8d2cd907fb";
    if (decodedPass === currentPasswordHash) {
      renderApp();
    } else {
      localStorage.setItem("pagePassword", "");
      alert("Incorrect password");
      setTimeout(() => window.location.reload(), 500);
    }
  }
};

checkAppRender();
