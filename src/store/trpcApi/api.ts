import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ReservePrize = {
  prize: {
    id: number;
    hash: string;
    value: number;
  };
  message: string;
};

type SwapKitResponse<T = null> = { result: { data: { json: T } } }[];

const localApi = false;
const baseURL = localApi ? "http://localhost:3000" : "https://v3-dex.vercel.app";

const toTRPCParams = (params: Todo) =>
  encodeURIComponent(JSON.stringify({ "0": { json: params } }));
const getTRPCResData = <T = null>(res: SwapKitResponse<T>) => {
  try {
    return res[0].result.data.json;
  } catch (_e) {
    return null;
  }
};

export const trpcApi = createApi({
  reducerPath: "trpcApi",
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api/trpc`,
    mode: "cors",
  }),
  endpoints: (build) => ({
    validateUrl: build.query<ReservePrize | null, string>({
      query: (name) => `xmas.validate?batch=1&input=${toTRPCParams(name)}`,
      transformResponse: (response: SwapKitResponse<ReservePrize>) => getTRPCResData(response),
    }),
    reserve: build.mutation<ReservePrize | null, { hash: string; wallet: string }>({
      query: ({ hash, wallet }) => ({
        url: "xmas.reserve?batch=1",
        method: "POST",
        body: { "0": { json: { hash, wallet } } },
      }),
      transformResponse: (response: SwapKitResponse<ReservePrize>) => getTRPCResData(response),
    }),
  }),
});

export const { useReserveMutation, useValidateUrlQuery } = trpcApi;
