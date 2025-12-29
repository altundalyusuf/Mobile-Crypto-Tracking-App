import { useEffect, useState } from "react";
import { Coin } from "../../../types/coin";
import { CoinsResponse } from "../../../types/coin";

interface UseCoinPaginationParams {
  data: CoinsResponse | undefined;
  limit: number;
  offset: number;
  debouncedSearch: string;
  orderBy: string;
}

interface UseCoinPaginationReturn {
  allCoins: Coin[];
  hasMore: boolean;
}

/**
 * Custom hook that manages coin pagination and data aggregation
 * Handles duplicate filtering, pagination state, and search/orderBy resets
 */
export const useCoinPagination = ({
  data,
  limit,
  offset,
  debouncedSearch,
  orderBy,
}: UseCoinPaginationParams): UseCoinPaginationReturn => {
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Reset coins when search or orderBy changes
  useEffect(() => {
    setAllCoins([]);
  }, [orderBy, debouncedSearch]);

  // Aggregate coins data with duplicate filtering
  useEffect(() => {
    if (data?.data?.coins) {
      const newCoins = data.data.coins;

      if (offset === 0 || debouncedSearch) {
        // Replace all coins on new search or first page
        setAllCoins(newCoins);
      } else {
        // Append new coins and filter duplicates
        setAllCoins((prev) => {
          const existingUuids = new Set(prev.map((coin) => coin.uuid));
          const uniqueNewCoins = newCoins.filter(
            (coin) => !existingUuids.has(coin.uuid)
          );
          return [...prev, ...uniqueNewCoins];
        });
      }

      // Update hasMore based on returned data length
      if (newCoins.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [data, offset, debouncedSearch, orderBy, limit]);

  return {
    allCoins,
    hasMore,
  };
};
