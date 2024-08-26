import { TRACKER_V2_PROVIDERS } from "./constants";

export const isV2TrackerSupported = (provider: string | string[]) =>
  !!TRACKER_V2_PROVIDERS.find((p) =>
    p.startsWith(typeof provider === "string" ? provider : provider[0]),
  );
