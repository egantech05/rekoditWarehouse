import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { menuBarStyle } from "./styles";
import { colors } from "../../assets/styles";

const baseH = 0;
const baseS = 2;
const baseL = 11;
const lStep = 8;

export default function MenuBar({ items = [], onItemPress = () => { } }) {
    if (!items.length) return null;

    return (
        <View style={menuBarStyle.container}>
            {items.map((item, index) => {
                const press = item.onPress || (() => onItemPress(item, index));
                const isFirst = index === 0;
                const zIndex = items.length - index;
                const marginTop = isFirst ? 0 : -24;

                const autoColor = isFirst
                    ? colors.boldColor
                    : `hsl(${baseH} ${baseS}% ${Math.max(0, baseL + lStep * index)}%)`;
                const backgroundColor = item.backgroundColor || autoColor;

                return (
                    <Pressable
                        key={item.key || index}
                        onPress={press}
                        style={[
                            isFirst ? menuBarStyle.firstBar : menuBarStyle.bar,
                            !isFirst && menuBarStyle.followingBar,
                            { zIndex, marginTop, backgroundColor },
                        ]}
                    >
                        <Text
                            style={[
                                isFirst ? menuBarStyle.firstBarText : menuBarStyle.followingBarText,
                                item.textStyle,
                            ]}
                        >
                            {item.label}
                        </Text>
                        {item.icon ? (
                            <Ionicons name={item.icon.name} size={24} color={item.icon.color || "white"} />
                        ) : null}
                    </Pressable>
                );
            })}
        </View>
    );
}
