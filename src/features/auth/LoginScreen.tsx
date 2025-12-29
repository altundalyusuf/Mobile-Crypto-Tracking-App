import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { clearError, login, signUp } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { colors } from "../../theme/colors";

type Mode = "login" | "signup";

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create account"),
    [mode]
  );

  const subtitle = useMemo(
    () => (mode === "login" ? "Sign in to continue" : "Sign up to get started"),
    [mode]
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    if (mode === "login") {
      dispatch(login({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
    }
  }, [dispatch, email, password, mode]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && !loading ? styles.buttonPressed : null,
            loading ? styles.buttonDisabled : null,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.buttonText}>
              {mode === "login" ? "Login" : "Sign Up"}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.toggle}
          onPress={toggleMode}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  toggle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});

export default LoginScreen;
