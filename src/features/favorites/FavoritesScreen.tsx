import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetCoinsQuery } from "../../api/coinsApi";
import { toggleFavorite } from "./favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { colors } from "../../theme/colors";
import { Coin } from "../../types/coin";
import CoinCard from "../market/components/CoinCard";
import CoinDetailModal from "../market/components/CoinDetailModal";

export default function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchText, setSearchText] = useState("");

  const favoriteUuids = useMemo(
    () => favorites.map((coin) => coin.uuid),
    [favorites]
  );

  const { data, isFetching } = useGetCoinsQuery(
    { uuids: favoriteUuids, limit: 50 },
    {
      skip: favoriteUuids.length === 0,
      refetchOnMountOrArgChange: true,
      pollingInterval: 120000,
    }
  );

  const displayData = useMemo(() => {
    if (data?.data?.coins) {
      return data.data.coins;
    }
    return favorites;
  }, [data, favorites]);

  const filteredFavorites = useMemo(() => {
    if (!searchText.trim()) {
      return displayData;
    }
    const searchLower = searchText.toLowerCase().trim();
    return displayData.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchLower) ||
        coin.symbol.toLowerCase().includes(searchLower)
    );
  }, [displayData, searchText]);

  const handleFavoritePress = (coin: Coin): void => {
    dispatch(toggleFavorite(coin));
  };

  const handleCoinPress = (coin: Coin): void => {
    setSelectedCoin(coin);
    setModalVisible(true);
  };

  const renderCoin = ({ item }: { item: Coin }) => (
    <CoinCard
      coin={item}
      onFavoritePress={handleFavoritePress}
      onPress={handleCoinPress}
      isFavorite={true}
    />
  );

  const renderEmptyComponent = () => {
    if (favorites.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.subText}>
            Start adding coins to track them here
          </Text>
        </View>
      );
    }
    if (filteredFavorites.length === 0 && searchText.trim()) {
      return (
        <Text style={styles.emptyText}>
          No favorites found matching '{searchText}'
        </Text>
      );
    }
    return null;
  };

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
          placeholder="Search favorites..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {isFetching && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        renderItem={renderCoin}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />
      <CoinDetailModal
        visible={isModalVisible}
        coin={selectedCoin}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: "center",
    marginTop: 50,
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  refreshIndicator: {
    alignItems: "center",
    paddingVertical: 4,
  },
});
