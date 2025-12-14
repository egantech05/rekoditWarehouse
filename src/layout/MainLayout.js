import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

import { mainStyles } from "../assets/styles";
import Header from "./Header";
import NavBar from "../components/NavBar";
import WarehouseSelection from "../components/WarehouseSelection";

export default function MainLayout() {
    const [panel, setPanel] = useState(null);

    const handleMenuPress = () => {
        setPanel((p) => (p === "nav" ? null : "nav"));
    };

    const handleWarehousePress = () => {
        setPanel("warehouse");
    };

    const closePanels = () => setPanel(null);

    return (
        <SafeAreaView style={mainStyles.container} edges={["top", "left", "right"]}>
            <Header onMenuPress={handleMenuPress} />
            <View style={mainLayoutStyles.body}>
                {panel && (
                    <Pressable style={mainLayoutStyles.overlay} onPress={closePanels}>
                        <Pressable onPress={() => { }} style={mainLayoutStyles.panelInner}>
                            {panel === "nav" && <NavBar onWarehousePress={handleWarehousePress} />}
                            {panel === "warehouse" && <WarehouseSelection />}
                        </Pressable>
                    </Pressable>
                )}
                <View style={mainLayoutStyles.mainContent} />
            </View>
        </SafeAreaView>
    );
}

const mainLayoutStyles = StyleSheet.create({
    mainContent: {
        flex: 1,
        flexDirection: "row",
    },
    body: {
        flex: 1,
        position: "relative",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 50,
    },
    panel: {
        height: "100%",
    },
    panelInner: { alignSelf: "stretch" },
});
