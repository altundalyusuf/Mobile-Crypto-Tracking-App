import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { colors } from "../../../theme/colors";
import { Coin } from "../../../types/coin";
import { formatPrice, getFileExtension } from "../../../utils/formatters";

interface CoinCardProps {
  coin: Coin;
  onFavoritePress: (coin: Coin) => void;
  onPress?: (coin: Coin) => void;
  isFavorite?: boolean;
}

function CoinCard({
  coin,
  onFavoritePress,
  onPress,
  isFavorite = false,
}: CoinCardProps) {
  const [imageError, setImageError] = useState(false);
  // Safely parse values with fallback for invalid numbers
  const change = parseFloat(coin.change) || 0;
  const isPositive = change >= 0;
  const price = parseFloat(coin.price) || 0;

  const renderFallback = () => (
    <View style={styles.iconFallback}>
      <Text style={styles.iconFallbackText}>
        {coin.symbol ? coin.symbol.charAt(0).toUpperCase() : "?"}
      </Text>
    </View>
  );

  const renderIcon = () => {
    if (!coin.iconUrl || imageError) {
      return renderFallback();
    }

    const fileExtension = getFileExtension(coin.iconUrl);
    const isSvg = fileExtension === "svg";
    const isImage =
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg";

    if (isSvg) {
      return (
        <SvgUri
          uri={coin.iconUrl}
          width={40}
          height={40}
          onError={() => setImageError(true)}
        />
      );
    }

    if (isImage) {
      return (
        <Image
          source={{ uri: coin.iconUrl }}
          style={styles.icon}
          onError={() => setImageError(true)}
          resizeMode="contain"
        />
      );
    }

    return renderFallback();
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(coin)}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.infoContainer}>
        <Text style={styles.coinName} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={styles.coinSymbol}>{coin.symbol}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        <Text
          style={[
            styles.change,
            isPositive ? styles.changePositive : styles.changeNegative,
          ]}
        >
          {isPositive ? "+" : ""}
          {isFinite(change) ? change.toFixed(2) : "0.00"}%
        </Text>
      </View>
      <Pressable
        onPress={() => onFavoritePress(coin)}
        style={styles.favoriteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? colors.error : colors.textSecondary}
        />
      </Pressable>
    </Pressable>
  );
}

export default React.memo(CoinCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconFallbackText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  coinName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  coinSymbol: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  priceContainer: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  price: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
  },
  changePositive: {
    color: colors.success,
  },
  changeNegative: {
    color: colors.error,
  },
  favoriteButton: {
    padding: 4,
  },
});
