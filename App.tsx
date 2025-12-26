import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Alert, Pressable } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { store } from "./src/store/store";
import { useAppDispatch, useAppSelector } from "./src/store/hooks";
import {
  checkSession,
  setSession,
  signOut,
} from "./src/features/auth/authSlice";
import { supabase } from "./src/lib/supabase";
import LoginScreen from "./src/features/auth/LoginScreen";
import HomeScreen from "./src/features/market/HomeScreen";
import { colors } from "./src/theme/colors";

type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check session on app start
    dispatch(checkSession());

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(
        setSession({
          session,
          user: session?.user ?? null,
        })
      );
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleLogout = () => {
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Crypto Market",
              headerRight: () => (
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={colors.text}
                  />
                </Pressable>
              ),
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
      <StatusBar
        style="light"
        translucent={false}
        backgroundColor={colors.card}
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
    padding: 4,
  },
});
