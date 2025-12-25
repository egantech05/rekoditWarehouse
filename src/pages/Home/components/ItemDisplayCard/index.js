import { View, Text, Pressable } from "react-native";

import { ItemDisplayCardStyles } from "./styles";

export default function ItemDisplayCard ({ onPress,item,title, templateName, quantity }){

    const displayTtitle = title ?? item?.name ?? "Item";
    const displayTemplate = templateName ?? item?.template_name ?? "Template";
    const displayQuantity = quantity?? item?.quantity ?? 0;
    return(
        <Pressable style={ItemDisplayCardStyles.container} onPress={onPress}>
                <View style={ItemDisplayCardStyles.topSection}>
                    <View style={ItemDisplayCardStyles.quantityPill}>
                        <Text style={ItemDisplayCardStyles.quantityPillText}>{String(displayQuantity)}</Text></View>
                </View>
                <View style={ItemDisplayCardStyles.bottomSection}>
                    <Text style={ItemDisplayCardStyles.title}>{displayTitle}</Text>
                    <View style={ItemDisplayCardStyles.pill}>
                        <Text style={ItemDisplayCardStyles.pillText}>{displayTemplate}</Text>
                    </View>

                </View>
        </Pressable>
    );
}