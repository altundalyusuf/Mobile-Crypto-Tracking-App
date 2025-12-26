import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CoinsResponse, GetCoinsParams } from "../types/coin";

export const coinsApi = createApi({
  reducerPath: "coinsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coinranking.com/v2",
    prepareHeaders: (headers, { getState }) => {
      // Optional: Add x-access-token if available
      // const token = (getState() as RootState).auth.session?.access_token;
      // if (token) {
      //   headers.set("x-access-token", token);
      // }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCoins: builder.query<CoinsResponse, GetCoinsParams>({
      query: (params) => {
        const { limit = 50, offset = 0, orderBy } = params;
        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        if (orderBy) {
          queryParams.append("orderBy", orderBy);
        }

        return {
          url: `/coins?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetCoinsQuery } = coinsApi;

