import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Coin } from "../../../types/coin";
import { colors } from "../../../theme/colors";

interface CoinDetailModalProps {
  visible: boolean;
  onClose: () => void;
  coin: Coin | null;
}

// Helper function to replace .svg extension with .png
const getImageUrl = (url: string): string => {
  if (!url) return "";
  return url.replace(/\.svg$/i, ".png");
};

export default function CoinDetailModal({
  visible,
  onClose,
  coin,
}: CoinDetailModalProps) {
  if (!coin) return null;

  const price = parseFloat(coin.price);
  const change = parseFloat(coin.change);
  const isPositive = change >= 0;

  const formatPrice = (value: number): string => {
    if (value >= 1) {
      return `$${value.toFixed(2)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  const formatLargeNumber = (value: string): string => {
    const num = parseFloat(value);
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={28}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            {/* Header: Icon, Name, Symbol */}
            <View style={styles.header}>
              <Image
                source={{ uri: getImageUrl(coin.iconUrl) }}
                style={styles.coinIcon}
                resizeMode="contain"
              />
              <View style={styles.headerInfo}>
                <Text style={styles.coinName}>{coin.name}</Text>
                <Text style={styles.coinSymbol}>{coin.symbol}</Text>
              </View>
            </View>

            {/* Price (Large) */}
            <View style={styles.priceSection}>
              <Text style={styles.price}>{formatPrice(price)}</Text>
              <Text
                style={[
                  styles.change,
                  isPositive ? styles.changePositive : styles.changeNegative,
                ]}
              >
                {isPositive ? "+" : ""}
                {change.toFixed(2)}%
              </Text>
            </View>

            {/* Stats: Market Cap and Rank */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Market Cap</Text>
                <Text style={styles.statValue}>
                  {formatLargeNumber(coin.marketCap)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rank</Text>
                <Text style={styles.statValue}>#{coin.rank}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: "90%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  coinIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  coinName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  coinSymbol: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  priceSection: {
    marginBottom: 32,
  },
  price: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  change: {
    fontSize: 18,
    fontWeight: "600",
  },
  changePositive: {
    color: colors.success,
  },
  changeNegative: {
    color: colors.error,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
