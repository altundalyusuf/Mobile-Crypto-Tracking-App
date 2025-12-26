import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Crypto Market</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
});
