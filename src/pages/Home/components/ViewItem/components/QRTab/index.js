import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../../../assets/styles";
import QRCode from "react-native-qrcode-svg";


export default function QRTab({ item }) {
  const webBaseUrl = String(process.env.EXPO_PUBLIC_WEB_URL ?? "").trim();
  const normalizedBase = webBaseUrl.replace(/\/+$/, "");
  const publicToken = item?.public_token ?? "";
  const publicUrl = normalizedBase && publicToken ? `${normalizedBase}/public/${publicToken}` : "";

  return (
    <View style={styles.container}>

      <View style={styles.qr}>
      {!!publicUrl && <QRCode value={publicUrl} size={200} />}
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },

  qr:{
    backgroundColor: "white",
    padding:16,
    borderRadius:16,
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },

  helperText: {
    color: colors.greyText,
  },
  linkBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brightDarker,
  },
  linkLabel: {
    color: colors.boldColor,
    fontWeight: "bold",
    marginBottom: 6,
  },
  linkText: {
    color: colors.tertiary,
  },


});