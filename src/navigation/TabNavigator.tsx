import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signOut } from "../features/auth/authSlice";
import FavoritesScreen from "../features/favorites/FavoritesScreen";
import HomeScreen from "../features/market/HomeScreen";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { colors } from "../theme/colors";

type TabParamList = {
  Home: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { loading: authLoading } = useAppSelector((state) => state.auth);

  const handleLogout = (): void => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          dispatch(signOut());
        },
      },
    ]);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "700",
          },
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: Math.max(insets.bottom, 10),
            paddingTop: 10,
            height: 70 + Math.max(insets.bottom, 10),
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Crypto Market",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={handleLogout}
                style={styles.logoutButton}
                disabled={authLoading}
              >
                {authLoading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Ionicons name="log-out-outline" size={24} color={colors.text} />
                )}
              </Pressable>
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            title: "Favorites",
            tabBarLabel: "Favorites",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={handleLogout}
                style={styles.logoutButton}
                disabled={authLoading}
              >
                {authLoading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Ionicons name="log-out-outline" size={24} color={colors.text} />
                )}
              </Pressable>
            ),
          }}
        />
      </Tab.Navigator>
      {authLoading && (
        <Modal transparent visible={authLoading} animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Logging out...</Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    padding: 4,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    minWidth: 150,
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
});
