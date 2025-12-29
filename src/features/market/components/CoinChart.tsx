import { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useGetCoinHistoryQuery } from "../../../api/coinsApi";
import { colors } from "../../../theme/colors";
import { formatPrice } from "../../../utils/formatters";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 80;

interface CoinChartProps {
  coinId: string;
  priceChange: string;
}

export default function CoinChart({ coinId, priceChange }: CoinChartProps) {
  const { data, error, isLoading } = useGetCoinHistoryQuery({
    uuid: coinId,
    timePeriod: "24h",
  });

  const chartColor =
    parseFloat(priceChange) < 0 ? colors.error : colors.success;

  const { chartData, spacing, yAxisOffset, relativeMaxValue, minVal, maxVal } =
    useMemo(() => {
      if (!data?.data?.history || data.data.history.length === 0) {
        return {
          chartData: [],
          spacing: 0,
          yAxisOffset: 0,
          relativeMaxValue: 100,
          minVal: 0,
          maxVal: 0,
        };
      }

      const rawData = data.data.history;
      const filteredData = rawData.filter((_, index) => index % 5 === 0);

      const processed = [...filteredData].reverse().map((point) => ({
        value: parseFloat(point.price),
      }));

      const calculatedSpacing =
        processed.length > 1 ? CHART_WIDTH / (processed.length - 1) : 0;

      const values = processed.map((d) => d.value);
      const calculatedMaxVal = Math.max(...values);
      const calculatedMinVal = Math.min(...values);
      const range = calculatedMaxVal - calculatedMinVal;

      const padding = range === 0 ? calculatedMaxVal * 0.05 : range * 0.1;

      const calculatedOffset = Math.max(0, calculatedMinVal - padding);
      const calculatedRelativeMax =
        calculatedMaxVal + padding - calculatedOffset;

      return {
        chartData: processed,
        spacing: calculatedSpacing,
        yAxisOffset: calculatedOffset,
        relativeMaxValue: calculatedRelativeMax,
        minVal: calculatedMinVal,
        maxVal: calculatedMaxVal,
      };
    }, [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load chart</Text>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No chart data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {chartData.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>24h Low</Text>
            <Text style={styles.statValue}>{formatPrice(minVal)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>24h High</Text>
            <Text style={styles.statValue}>{formatPrice(maxVal)}</Text>
          </View>
        </View>
      )}
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={150}
        color={chartColor}
        thickness={2}
        curved
        isAnimated
        hideDataPoints
        hideYAxisText
        hideRules
        hideAxesAndRules
        areaChart
        startFillColor={chartColor}
        endFillColor={chartColor}
        startOpacity={0.15}
        endOpacity={0}
        spacing={spacing}
        initialSpacing={0}
        endSpacing={0}
        yAxisOffset={yAxisOffset}
        maxValue={relativeMaxValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 0,
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
