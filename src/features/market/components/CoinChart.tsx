import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useGetCoinHistoryQuery } from "../../../api/coinsApi";
import { colors } from "../../../theme/colors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 80;

interface CoinChartProps {
  coinId: string;
}

export default function CoinChart({ coinId }: CoinChartProps) {
  const { data, error, isLoading } = useGetCoinHistoryQuery({
    uuid: coinId,
    timePeriod: "24h",
  });

  const { chartData, spacing, yAxisOffset, relativeMaxValue } = useMemo(() => {
    if (!data?.data?.history || data.data.history.length === 0) {
      return {
        chartData: [],
        spacing: 0,
        yAxisOffset: 0,
        relativeMaxValue: 100,
      };
    }

    // --- Optimization here ---
    // The raw data from the API can be very dense.
    // We are only taking 1 out of 5.
    // This reduces the render load by 80%, the chart appears immediately.
    const rawData = data.data.history;
    const filteredData = rawData.filter((_, index) => index % 5 === 0);
    // If the chart is too jagged, you can change '5' to '3'.

    // String -> Number and Reverse
    const processed = [...filteredData].reverse().map((point) => ({
      value: parseFloat(point.price),
    }));

    // Spacing Calculation
    const calculatedSpacing =
      processed.length > 1 ? CHART_WIDTH / (processed.length - 1) : 0;

    // --- MIN/MAX LOGIC (Same as before) ---
    const values = processed.map((d) => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal;

    const padding = range === 0 ? maxVal * 0.05 : range * 0.1;

    const calculatedOffset = Math.max(0, minVal - padding);
    const calculatedRelativeMax = maxVal + padding - calculatedOffset;

    return {
      chartData: processed,
      spacing: calculatedSpacing,
      yAxisOffset: calculatedOffset,
      relativeMaxValue: calculatedRelativeMax,
    };
  }, [data]);

  // Color Selection
  const chartColor = useMemo(() => {
    if (chartData.length < 2) return colors.primary;
    const firstPrice = chartData[0].value;
    const lastPrice = chartData[chartData.length - 1].value;
    return lastPrice >= firstPrice ? colors.success : colors.error;
  }, [chartData]);

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
    height: 150,
    width: "100%",
    marginTop: 0, // Reset the top margin
    marginBottom: 20, // Just a little space at the bottom
    justifyContent: "flex-start", // Cancel the alignment, align to the top
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
