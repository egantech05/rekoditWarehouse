
import { View, Text, Pressable,StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../../assets/styles"

export default function TabButtons({ selectedTab, onSelectTab }){

    const isInfo = selectedTab === "info";
    const isHistory = selectedTab === "history";
    const isQr = selectedTab === "qr";

    return(
        <View style={TabBtnStyles.tabSelection}>
            <Pressable
                style={[TabBtnStyles.tabBtn, isInfo && TabBtnStyles.tabSelected]}
                onPress={() => onSelectTab("info")}
            >
                <Ionicons name="information-circle-outline" size={24} color={colors.boldColor} />
            </Pressable>

            <Pressable
            style={[TabBtnStyles.tabBtn, isHistory && TabBtnStyles.tabSelected]}
            onPress={() => onSelectTab("history")}
            >
                <Ionicons name="time-outline" size={24} color={colors.boldColor} />
            </Pressable>
            <Pressable
                style={[TabBtnStyles.tabBtn, isQr && TabBtnStyles.tabSelected]}
                onPress={() => onSelectTab("qr")}
            >
                <Ionicons name="qr-code-outline" size={24} color={colors.boldColor} />
            </Pressable>
        </View>
    );

};

export const TabBtnStyles = StyleSheet.create({
    tabSelection:{
        backgroundColor: colors.bright,
        padding:4,
        flexDirection: "row",
        borderRadius: 8,
      },

      tabSelected:{
        backgroundColor: "white",
        borderRadius: 8,   
      },

      tabBtn:{
        paddingVertical:8,
        paddingHorizontal:16,
      },
});