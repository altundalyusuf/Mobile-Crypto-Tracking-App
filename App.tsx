import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store, RootState } from "./src/store/store";
import { useAppDispatch, useAppSelector } from "./src/store/hooks";
import { checkSession, setSession } from "./src/features/auth/authSlice";
import { loadFavorites } from "./src/features/favorites/favoritesSlice";
import { supabase } from "./src/lib/supabase";
import LoginScreen from "./src/features/auth/LoginScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import { colors } from "./src/theme/colors";

type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check session on app start
    dispatch(checkSession());

    // Load favorites from AsyncStorage on app start
    dispatch(loadFavorites());

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

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
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
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}
