import { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { colors } from "../../theme/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite } from "./favoritesSlice";
import { Coin } from "../../types/coin";
import CoinCard from "../market/components/CoinCard";
import CoinDetailModal from "../market/components/CoinDetailModal";

export default function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const handleFavoritePress = (coin: Coin) => {
    dispatch(toggleFavorite(coin));
  };

  const handleCoinPress = (coin: Coin) => {
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

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No favorites yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderCoin}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorites yet</Text>
        }
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
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 32,
  },
});
