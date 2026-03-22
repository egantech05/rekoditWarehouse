import { View, Text, StyleSheet, Platform } from "react-native";
import { useCallback, useEffect, useRef } from "react";
import { colors } from "../../../../../../assets/styles";
import QRCode from "react-native-qrcode-svg";


export default function QRTab({ item, onBindDownload }) {
  
  const webBaseUrl = String(process.env.EXPO_PUBLIC_WEB_URL ?? "").trim();
  const normalizedBase = webBaseUrl.replace(/\/+$/, "");
  const publicToken = item?.public_token ?? "";
  const publicUrl = normalizedBase && publicToken ? `${normalizedBase}/public/${publicToken}` : "";

  const qrRef = useRef(null);

  const downloadQr = useCallback(async () => {
    if (Platform.OS !== "web") return;
    if (!publicUrl || !qrRef.current) return;

    try {
      const base64 = await new Promise((resolve, reject) => {
        try {
          qrRef.current.toDataURL((data) => resolve(data));
        } catch (e) {
          reject(e);
        }
      });

      const dataUrl = `data:image/png;base64,${base64}`;
      const filename = `qr-${item?.id ?? "code"}.png`;
      const isMobileWeb =
        typeof navigator !== "undefined" &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobileWeb && typeof navigator !== "undefined" && navigator.share) {
        const blob = await fetch(dataUrl).then((r) => r.blob());
        const file = new File([blob], filename, { type: "image/png" });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "QR Code" });
          return;
        }
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {}
  }, [publicUrl, item?.id]);

  useEffect(() => {
    onBindDownload?.(downloadQr);
    return () => onBindDownload?.(null);
  }, [onBindDownload, downloadQr]);


  return (
    <View style={styles.container}>

      <View style={styles.qr}>
        {!!publicUrl && (
          <QRCode
            value={publicUrl}
            backgroundColor="transparent"
            size={200}
            getRef={(c) => {
              qrRef.current = c;
            }}
          />
        )}

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