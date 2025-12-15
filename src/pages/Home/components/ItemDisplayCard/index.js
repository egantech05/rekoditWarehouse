import { View, Text, Pressable } from "react-native";

import { ItemDisplayCardStyles } from "./styles";

export default function ItemDisplayCard (){
    return(
        <Pressable style={ItemDisplayCardStyles.container}>
                <View style={ItemDisplayCardStyles.topSection}>
                    <View style={ItemDisplayCardStyles.quantityPill}>
                        <Text style={ItemDisplayCardStyles.quantityPillText}>1000</Text></View>
                </View>
                <View style={ItemDisplayCardStyles.bottomSection}>
                    <Text style={ItemDisplayCardStyles.title}>Item Name</Text>
                    <View style={ItemDisplayCardStyles.pill}>
                        <Text style={ItemDisplayCardStyles.pillText}>Template Name</Text>
                    </View>

                </View>
        </Pressable>
    );
}