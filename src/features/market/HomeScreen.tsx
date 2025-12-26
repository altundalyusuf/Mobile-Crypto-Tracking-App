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

export default function HomeScreen() {
  const { data, error, isLoading } = useGetCoinsQuery({
    limit: 20,
    offset: 0,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading coins...</Text>
      </View>
    );
  }

  if (error) {
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

  const coins = data?.data?.coins || [];

  const renderCoin = ({ item }: { item: Coin }) => (
    <View style={styles.coinItem}>
      <Text style={styles.coinName}>{item.name}</Text>
      <Text style={styles.coinPrice}>${parseFloat(item.price).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coins}
        renderItem={renderCoin}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No coins found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  coinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    marginBottom: 8,
    borderRadius: 8,
  },
  coinName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  coinPrice: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
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
});
