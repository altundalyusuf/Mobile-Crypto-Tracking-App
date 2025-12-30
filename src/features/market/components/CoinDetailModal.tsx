import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { Coin } from "../../../types/coin";
import CoinChart from "./CoinChart";
import {
  formatPrice,
  formatLargeNumber,
  getImageUrl,
} from "../../../utils/formatters";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAG_THRESHOLD = 100;

interface CoinDetailModalProps {
  visible: boolean;
  onClose: () => void;
  coin: Coin | null;
}

export default function CoinDetailModal({
  visible,
  onClose,
  coin,
}: CoinDetailModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // We are not using offset, starting from 0
      },

      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy >= 0) {
          translateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        // If the modal is dragged quickly or sufficiently downward, close it
        if (gestureState.dy > DRAG_THRESHOLD || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          // If the modal is not closed, spring back to the original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  // Reset the position when the modal is opened
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible, translateY]);

  if (!coin) return null;

  // Safely parse values with fallback for invalid numbers
  const price = parseFloat(coin.price) || 0;
  const change = parseFloat(coin.change) || 0;
  const isPositive = change >= 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === "android"}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle Bar (Drag Zone)*/}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Content */}
          <View style={styles.content}>
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

            <View style={styles.priceSection}>
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

            <CoinChart coinId={coin.uuid} priceChange={coin.change} />

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
        </Animated.View>
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
    maxHeight: "90%",
    width: "100%",
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 8,
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
