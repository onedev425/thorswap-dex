import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const localApi = false;
const baseURL = localApi ? 'http://localhost:3000' : 'https://dashboard-swapkit.vercel.app';

const toTRPCParams = (params: any) => encodeURIComponent(JSON.stringify({ '0': { json: params } }));
const getTRPCResData = <T>(res: SwapKitArrayResponse<T>) => res?.[0]?.result?.data?.json;

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

type SwapKitArrayResponse<T> = { result: { data: { json: Promise<T> | T } } }[];
type SwapKitResponse<T> = { result: { data: { json: Promise<T> | T } } };

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
      transformResponse: (response: SwapKitArrayResponse<EasterEgg>) => getTRPCResData(response),
    }),
    eggAvailable: build.query<boolean, void>({
      query: () => 'eggHunt.eggAvailable',
      transformResponse: (response: SwapKitResponse<boolean>) => response?.result?.data?.json,
    }),

    huntEgg: build.mutation<
      EasterEgg | InvalidHunt | null,
      { eggHash: string; userWallet: string }
    >({
      query: ({ eggHash, userWallet }) => ({
        url: 'eggHunt.huntEgg?batch=1',
        method: 'POST',
        body: { '0': { json: { eggHash, userWallet } } },
      }),
      transformResponse: (response: SwapKitArrayResponse<EasterEgg | InvalidHunt>) =>
        getTRPCResData(response),
    }),
  }),
});

export const { useEggAvailableQuery, useValidateEggQuery, useHuntEggMutation } = swapKitDashboard;
