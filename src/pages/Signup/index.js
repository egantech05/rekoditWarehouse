import { useEffect, useState } from "react";
import { Modal, ScrollView, View, StyleSheet, Text } from "react-native";

import ViewModal from "../../components/ViewModal";
import FooterTextButton from "../../components/FooterTextButton";
import InputBox from "../../components/InputBox";
import { colors } from "../../assets/styles";
import { useAuth } from "../../auth/AuthContext";

export default function Signup({ visible, onClose }) {
    const { signUp, logout } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);

    const handleClose = () => {
    setShowConfirmation(false);
    onClose?.();
    };

    useEffect(() => {
        if (!visible) {
          setShowConfirmation(false);
          return;
        }
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

      await logout().catch(() => {});
      setShowConfirmation(true);

    } catch (e) {
        const msg = (e?.message ?? "").toLowerCase();
      
        if (e?.status === 429) {
          setError("Too many signup attempts. Please wait and try again.");
        } else if (msg.includes("already") || msg.includes("registered") || msg.includes("user") && msg.includes("exists")) {
          setError("Account already exists.");
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
    <View>
        <ViewModal visible={visible} onClose={handleClose} title="Sign Up" footer={footer}>
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
        <Modal visible={showConfirmation} transparent animationType="fade" onRequestClose={handleClose}>
        <View style={styles.confirmOverlay}>
            <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Confirmation email has been sent</Text>

            <FooterTextButton
                text="OK"
                color={colors.boldColor}
                textColor={colors.brandHighlight}
                onPress={handleClose}
            />
            </View>
        </View>
        </Modal>
    </View>
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

  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.bright,
    borderRadius: 12,
    padding: 16,
  },
  confirmTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.boldColor,
    marginBottom: 8,
  },
  confirmText: {
    color: colors.boldColor,
    marginBottom: 16,
  },
});