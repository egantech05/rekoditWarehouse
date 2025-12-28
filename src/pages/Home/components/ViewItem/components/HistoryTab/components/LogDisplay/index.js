import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../../../../../assets/styles";
import { Ionicons } from "@expo/vector-icons";

export default function LogDisplay({ event }) {
  return (
    <View style={styles.container}>
        <View style={styles.leftSection}>
            <View style={styles.withIcon}>
                <Ionicons name="time-outline" size={16} color={colors.tertiary} />
                <Text style={styles.topText}>{new Date(event?.created_at).toLocaleString()}</Text>
            </View>
            <Text style={styles.bottomText}>{event?.note || event?.event_type}</Text>
        </View>
        <View style={styles.rightSection}>
            <View style={styles.withIcon}>
                <Text style={styles.topText}>{event?.actor_name || String(event?.actor_id ?? "")}</Text>
                <Ionicons name="person-circle-outline" size={18} color={colors.tertiary} />
            </View>
            <Text style={styles.bottomText}> {`${Number(event?.delta) >= 0 ? "+" : ""}${Number(event?.delta) || 0}`}</Text>
        </View>
   

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "white",
    padding:16,
  },

  leftSection:{
    gap:4,
    flex:1,
  },
  rightSection:{
    gap:4,
    alignItems: "flex-end",
  },

  withIcon:{
    flexDirection:"row",
    gap:4,
    alignItems: "center",
    
  },

  topText:{
    color: colors.tertiary,

  },

  bottomText:{
    color: colors.boldColor,
    fontWeight: "bold",
    
  },

});