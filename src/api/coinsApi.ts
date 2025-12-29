import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CoinsResponse,
  GetCoinsParams,
  CoinHistoryResponse,
  GetCoinHistoryParams,
} from "../types/coin";

export const coinsApi = createApi({
  reducerPath: "coinsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.coinranking.com/v2",
    prepareHeaders: (headers) => {
      const apiKey = process.env.EXPO_PUBLIC_COINRANKING_API_KEY;
      if (apiKey) {
        headers.set("x-access-token", apiKey);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 60,

  endpoints: (builder) => ({
    getCoins: builder.query<CoinsResponse, GetCoinsParams>({
      query: (params) => {
        const { limit = 50, offset = 0, orderBy, search, uuids } = params;
        const queryParams = new URLSearchParams();

        queryParams.append("limit", limit.toString());
        queryParams.append("offset", offset.toString());

        if (orderBy) {
          queryParams.append("orderBy", orderBy);
        }

        if (search?.trim()) {
          queryParams.append("search", search.trim());
        }

        if (uuids && uuids.length > 0) {
          uuids.forEach((uuid) => {
            queryParams.append("uuids[]", uuid);
          });
        }

        return {
          url: `/coins?${decodeURIComponent(queryParams.toString())}`,
          method: "GET",
        };
      },
    }),
    getCoinHistory: builder.query<CoinHistoryResponse, GetCoinHistoryParams>({
      query: (params) => {
        const { uuid, timePeriod = "24h" } = params;
        return {
          url: `/coin/${uuid}/history`,
          method: "GET",
          params: {
            timePeriod,
          },
        };
      },
    }),
  }),
});

export const { useGetCoinsQuery, useGetCoinHistoryQuery } = coinsApi;
