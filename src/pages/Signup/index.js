import { useEffect, useState } from "react";
import { Alert, ScrollView, View, StyleSheet, Text } from "react-native";

import ViewModal from "../../components/ViewModal";
import FooterTextButton from "../../components/FooterTextButton";
import InputBox from "../../components/InputBox";
import { colors } from "../../assets/styles";
import { useAuth } from "../../auth/AuthContext";

export default function Signup({ visible, onClose }) {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) return;
    setError("");
  }, [visible]);

  const onRegister = async () => {
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill out all fields!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don’t match!");
      return;
    }

    setLoading(true);
    try {
      await signUp(fullName, email, password);

      Alert.alert(
        "Check your email",
        "Confirm your email, then come back and log in.",
        [{ text: "OK", onPress: () => onClose?.() }]
      );
    } catch (e) {
        const msg = (e?.message ?? "").toLowerCase();
      
        if (e?.status === 429) {
          setError("Too many signup attempts. Please wait and try again.");
        } else if (msg.includes("already") || msg.includes("registered") || msg.includes("user") && msg.includes("exists")) {
          setError("Account already exists. Please log in.");
        } else {
          setError(e?.message ?? "Sign up failed!");
        }
      } finally {
        setLoading(false);
      }
  };

  const footer = (
    <FooterTextButton
      text={loading ? "Sending..." : "Register"}
      color={colors.boldColor}
      textColor={colors.brandHighlight}
      onPress={onRegister}
      disabled={loading}
    />
  );

  return (
    <ViewModal visible={visible} onClose={onClose} title="Sign Up" footer={footer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <InputBox
          title="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"

        />
        <InputBox
          title="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"

        />
        <InputBox
          title="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <InputBox
          title="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {error ? <Text style={styles.validationAlert}>{error}</Text> : null}

        <View style={{ height: 16 }} />
      </ScrollView>
    </ViewModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  validationAlert: {
    color: colors.red,
    marginLeft: 18,
    marginTop: 8,
  },
});