import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../theme/colors";
import { useGetCoinsQuery } from "../../api/coinsApi";
import { Coin } from "../../types/coin";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite } from "../../features/favorites/favoritesSlice";
import CoinCard from "./components/CoinCard";

const LIMIT = 20;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data, error, isLoading, isFetching } = useGetCoinsQuery({
    limit: LIMIT,
    offset: offset,
  });

  // Update allCoins when new data arrives
  useEffect(() => {
    if (data?.data?.coins) {
      const newCoins = data.data.coins;

      if (offset === 0) {
        // First load or refresh - replace all coins
        setAllCoins(newCoins);
      } else {
        // Pagination - append new coins, filtering out duplicates by uuid
        setAllCoins((prev) => {
          const existingUuids = new Set(prev.map((coin) => coin.uuid));
          const uniqueNewCoins = newCoins.filter(
            (coin) => !existingUuids.has(coin.uuid)
          );
          return [...prev, ...uniqueNewCoins];
        });
      }

      // Check if there are more coins to load
      if (newCoins.length < LIMIT) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore && !isLoading) {
      setOffset((prev) => prev + LIMIT);
    }
  }, [isFetching, hasMore, isLoading]);

  const handleFavoritePress = (coin: Coin) => {
    dispatch(toggleFavorite(coin));
  };

  const renderCoin = ({ item }: { item: Coin }) => {
    const isFavorite = favorites.some((fav) => fav.uuid === item.uuid);
    return (
      <CoinCard
        coin={item}
        onFavoritePress={handleFavoritePress}
        isFavorite={isFavorite}
      />
    );
  };

  const renderFooter = () => {
    if (!isFetching || isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  if (isLoading && allCoins.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading coins...</Text>
      </View>
    );
  }

  if (error && allCoins.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading coins</Text>
        <Text style={styles.errorSubtext}>
          {"status" in error
            ? `Status: ${error.status}`
            : "Please try again later"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allCoins}
        renderItem={renderCoin}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No coins found</Text>
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    color: colors.textSecondary,
    marginLeft: 8,
    fontSize: 14,
  },
});
