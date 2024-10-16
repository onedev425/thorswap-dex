import "chart.js/auto";

import { Box, Icon } from "components/Atomic";
import { Layout } from "components/Layout";
import { ToastPortal } from "components/Toast";
import { GiftHunt } from "components/anniversary/GiftHunt";
import { isIframe } from "helpers/isIframe";
import { Suspense, lazy, memo, useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from "settings/router";
import { actions } from "store/app/slice";
import { useAppDispatch } from "store/store";
import { ToSView } from "views/ToS";
import * as z from "zod";

const Swap = lazy(() => import("views/Swap"));
const WalletBalance = lazy(() => import("views/WalletBalance"));
const Earn = lazy(() => import("views/Earn"));
const Send = lazy(() => import("views/Send"));
const Wallet = lazy(() => import("views/Wallet"));

export type RouteType = {
  path: string;
  element: NotWorth;
}[];

const commonRoutes = [
  { path: ROUTES.Swap, element: Swap },
  { path: ROUTES.SwapPair, element: Swap },
  { path: ROUTES.Okx, element: Swap },
  { path: ROUTES.OkxPair, element: Swap },
  { path: ROUTES.ToS, element: ToSView },
];

const routes: RouteType = isIframe()
  ? commonRoutes
  : [
      ...commonRoutes,
      { path: ROUTES.Earn, element: Earn },
      { path: ROUTES.EarnAsset, element: Earn },
      { path: ROUTES.Send, element: Send },
      { path: ROUTES.SendAsset, element: Send },
      { path: ROUTES.Wallet, element: Wallet },
    ];

const iframeParamsSchema = z.object({
  fee: z.number().int().positive(),
  address: z.string().min(1),
  basePair: z.string(),
  logoUrl: z.string(),
  isWidget: z.boolean(),
});

export const PublicRoutes = memo(() => {
  const appDispatch = useAppDispatch();
  useEffect(() => {
    if (isIframe()) {
      if (!window.location.search) {
        throw new Error("Invalid iframe");
      }

      const params = new URLSearchParams(window.location.search);
      const values = {
        fee: Number.parseInt(params.get("fee") ?? "50", 10),
        address: params.get("address") ?? "t",
        basePair: params.get("basePair") ?? "",
        logoUrl: params.get("logoUrl") ?? "",
        isWidget: params.has("widget"),
      };
      try {
        const iframeParams = iframeParamsSchema.parse(values);

        appDispatch(actions.setIframeData(iframeParams));
      } catch (_error) {
        throw new Error("Invalid iframe");
      }
    }
  }, [appDispatch]);

  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const Component = route.element;

          return (
            <Route
              element={
                <>
                  <WalletBalance />

                  <Layout>
                    <Suspense
                      fallback={
                        <Box center className="p-10" flex={1}>
                          <Icon spin name="loader" size={32} />
                        </Box>
                      }
                    >
                      <Component />
                      {/* <EggHunt /> */}
                      <GiftHunt />
                    </Suspense>
                  </Layout>
                </>
              }
              key={route.path}
              path={route.path}
            />
          );
        })}

        <Route element={<Navigate to="/swap" />} path="*" />
      </Routes>
      <ToastPortal />
    </Router>
  );
});
