import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const localApi = false;
const baseURL = localApi ? 'http://localhost:3000' : 'https://dashboard-swapkit.vercel.app';

const toTRPCParams = (params: any) => encodeURIComponent(JSON.stringify({ '0': { json: params } }));
const getTRPCResData = <T = null>(res: SwapKitReposnse<T>) => {
  try {
    return res[0].result.data.json;
  } catch (e) {
    return null;
  }
};

export type EasterEgg = {
  valid: boolean;
  egg: {
    id: number;
    eggHash: string;
    value: number;
  };
};

export type InvalidHunt = {
  valid: false;
  message: string;
};

type SwapKitReposnse<T = null> = { result: { data: { json: T } } }[];

export const swapKitDashboard = createApi({
  reducerPath: 'swapKitDashboard',
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api/trpc`,
    mode: 'cors',
  }),
  endpoints: (build) => ({
    validateEgg: build.query<EasterEgg | null, string>({
      query: (name) => `eggHunt.validate?batch=1&input=${toTRPCParams(name)}`,
      transformResponse: (response: SwapKitReposnse<EasterEgg>) => getTRPCResData(response),
    }),
    huntEgg: build.mutation<
      EasterEgg | InvalidHunt | null,
      { eggHash: string; userWallet: string }
    >({
      query: ({ eggHash, userWallet }) => ({
        url: `eggHunt.huntEgg?batch=1`,
        method: 'POST',
        body: { '0': { json: { eggHash, userWallet } } },
      }),
      transformResponse: (response: SwapKitReposnse<EasterEgg | InvalidHunt>) =>
        getTRPCResData(response),
    }),
  }),
});

export const { useValidateEggQuery, useHuntEggMutation } = swapKitDashboard;
