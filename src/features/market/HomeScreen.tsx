import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetCoinsQuery } from "../../api/coinsApi";
import { toggleFavorite } from "../../features/favorites/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { colors } from "../../theme/colors";
import { Coin } from "../../types/coin";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { useCoinPagination } from "./hooks/useCoinPagination";
import CoinCard from "./components/CoinCard";
import CoinDetailModal from "./components/CoinDetailModal";

const LIMIT = 20;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [orderBy, setOrderBy] = useState("marketCap");

  const debouncedSearch = useDebounce(searchText.trim(), 500);
  // API requires minimum search length of 2 characters
  const validSearch = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  useEffect(() => {
    setOffset(0);
  }, [orderBy, debouncedSearch]);

  const { data, error, isLoading, isFetching } = useGetCoinsQuery({
    limit: LIMIT,
    offset: offset,
    search: validSearch,
    orderBy: orderBy,
  });

  const { allCoins, hasMore } = useCoinPagination({
    data,
    limit: LIMIT,
    offset,
    debouncedSearch,
    orderBy,
    isFetching,
  });

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore && !isLoading && !debouncedSearch) {
      setOffset((prev) => prev + LIMIT);
    }
  }, [isFetching, hasMore, isLoading, debouncedSearch]);

  const handleFavoritePress = (coin: Coin): void => {
    dispatch(toggleFavorite(coin));
  };

  const handleCoinPress = (coin: Coin): void => {
    setSelectedCoin(coin);
    setModalVisible(true);
  };

  const handleFilterPress = (filter: string): void => {
    setOrderBy(filter);
    setOffset(0);
  };

  const filterOptions = [
    { key: "marketCap", label: "Market Cap" },
    { key: "price", label: "Price" },
    { key: "24hVolume", label: "24h Volume" },
    { key: "change", label: "Change" },
    { key: "listedAt", label: "Listed At" },
  ];

  const renderFilterChip = ({
    item,
  }: {
    item: { key: string; label: string };
  }) => {
    const isSelected = orderBy === item.key;
    return (
      <Pressable
        style={[
          styles.filterChip,
          isSelected ? styles.filterChipSelected : styles.filterChipUnselected,
        ]}
        onPress={() => handleFilterPress(item.key)}
      >
        <Text
          style={[
            styles.filterChipText,
            isSelected
              ? styles.filterChipTextSelected
              : styles.filterChipTextUnselected,
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const renderCoin = ({ item }: { item: Coin }) => {
    const isFavorite = favorites.some((fav) => fav.uuid === item.uuid);
    return (
      <CoinCard
        coin={item}
        onFavoritePress={handleFavoritePress}
        onPress={handleCoinPress}
        isFavorite={isFavorite}
      />
    );
  };

  const renderFooter = () => {
    if (!isFetching || isLoading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  let content;

  if ((isLoading || (isFetching && offset === 0)) && allCoins.length === 0) {
    content = (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading coins...</Text>
      </View>
    );
  } else if (error && allCoins.length === 0) {
    content = (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading coins</Text>
        <Text style={styles.errorSubtext}>
          {"status" in error
            ? `Status: ${error.status}`
            : "Please try again later"}
        </Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={allCoins}
        renderItem={renderCoin}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        style={styles.coinList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {debouncedSearch ? "No coins found" : "No coins available"}
          </Text>
        }
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 72,
          offset: 72 * index,
          index,
        })}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => {
          Keyboard.dismiss();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coins..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textSecondary}
            style={styles.clearIcon}
            onPress={() => setSearchText("")}
          />
        )}
      </View>

      <FlatList
        horizontal
        data={filterOptions}
        renderItem={renderFilterChip}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtersContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />

      {content}

      <CoinDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        coin={selectedCoin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    padding: 0,
  },
  clearIcon: {
    marginLeft: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterList: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: "center",
      },
    }),
  },
  filterChipTextSelected: {
    color: colors.text,
  },
  filterChipTextUnselected: {
    color: colors.textSecondary,
  },
  coinList: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
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
