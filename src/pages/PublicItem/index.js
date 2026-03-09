import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { colors } from "../../assets/styles";
import ViewItem from "../Home/components/ViewItem";
import { fetchPublicItemByToken } from "../../lib/api/publicClient";
import { useAuth } from "../../auth/AuthContext";
import { setPendingAuthItem, setPendingPublicToken } from "../../lib/publicRedirect";
import { CommonActions } from "@react-navigation/native";


import { useIsFocused } from "@react-navigation/native";




export default function PublicItem({ route, navigation }) {
  const publicToken = route?.params?.publicToken ?? route?.params?.token ?? null;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoggedIn } = useAuth();

  const isFocused = useIsFocused();


  const handleLogin = () => {
    if (!item?.id) return;
    setPendingAuthItem(item);
    setPendingPublicToken(null);

    const action = CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });

    const parent = navigation?.getParent?.();
    if (parent?.dispatch) {
      parent.dispatch(action);
    } else {
      navigation?.dispatch(action);
    }
  };



  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!publicToken) {
        setError("Missing public token.");
        setItem(null);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchPublicItemByToken({ publicToken });
        if (ignore) return;
        setItem(data);
        if (!data) setError("Item not found.");
      } catch (e) {
        if (ignore) return;
        setError(e?.message ?? "Failed to load item.");
        setItem(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [publicToken]);

  const handleClose = () => {
    if (navigation?.canGoBack?.()) navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={colors.boldColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Item not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <ViewItem
            visible={isFocused}
            onClose={handleClose}
            item={item}
            readOnly={true}
            headerActionLabel={isLoggedIn ? null : "Login"}
            onHeaderAction={isLoggedIn ? null : handleLogin}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: colors.red, textAlign: "center" },
});
