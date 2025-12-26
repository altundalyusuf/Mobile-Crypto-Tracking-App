import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Coin } from "../../../types/coin";
import { colors } from "../../../theme/colors";

interface CoinCardProps {
  coin: Coin;
  onFavoritePress: (coin: Coin) => void;
}

export default function CoinCard({ coin, onFavoritePress }: CoinCardProps) {
  const [imageError, setImageError] = useState(false);
  const change = parseFloat(coin.change);
  const isPositive = change >= 0;
  const price = parseFloat(coin.price);

  const formatPrice = (value: number): string => {
    if (value >= 1) {
      return `$${value.toFixed(2)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  // Check file extension to determine if it's SVG or image
  const getFileExtension = (url: string): string => {
    if (!url) return "";
    const match = url.match(/\.([^.?#]+)(\?|#|$)/);
    return match ? match[1].toLowerCase() : "";
  };

  // Render fallback circle with first letter
  const renderFallback = () => (
    <View style={styles.iconFallback}>
      <Text style={styles.iconFallbackText}>
        {coin.symbol ? coin.symbol.charAt(0).toUpperCase() : "?"}111
      </Text>
    </View>
  );

  // Render icon based on type
  const renderIcon = () => {
    // If no iconUrl or error occurred, show fallback
    if (!coin.iconUrl || imageError) {
      return renderFallback();
    }

    const fileExtension = getFileExtension(coin.iconUrl);
    const isSvg = fileExtension === "svg";
    const isImage =
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg";

    // Render SVG
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

    // Render PNG/JPG image
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

    // Fallback for unknown extensions or missing iconUrl
    return renderFallback();
  };

  return (
    <View style={styles.card}>
      {/* Left: Icon */}
      <View style={styles.iconContainer}>{renderIcon()}</View>

      {/* Middle: Name and Symbol */}
      <View style={styles.infoContainer}>
        <Text style={styles.coinName} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={styles.coinSymbol}>{coin.symbol}</Text>
      </View>

      {/* Right: Price and Change */}
      <View style={styles.priceContainer}>
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

      {/* Favorite Button */}
      <Pressable
        onPress={() => onFavoritePress(coin)}
        style={styles.favoriteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

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
    includeFontPadding: false,
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
