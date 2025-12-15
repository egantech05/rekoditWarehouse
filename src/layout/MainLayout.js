import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { useNavigationState } from "@react-navigation/native";
import StackNavigator from "../components/navigation/StackNavigator";

import { mainStyles } from "../assets/styles";
import Header from "./Header";
import NavBar from "../components/NavBar";
import WarehouseSelection from "../components/WarehouseSelection";
import StatusBar from "../components/StatusBar"
import PageTitle from "../components/PageTitle";
import SearchBar from "../components/SearchBar";
import AddCard from "../components/AddCard";

export default function MainLayout({ routeName }) {

    const pageTitleByRoute = {
    Home: "Inventory",
    Templates: "Inventory Template",
    Team: "Team",
    };

    const pageTitle = pageTitleByRoute[routeName] ?? "";

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
                                {panel === "nav" && <NavBar onWarehousePress={handleWarehousePress} onClose={closePanels}/>}
                                {panel === "warehouse" && <WarehouseSelection />}
                            </Pressable>
                        </Pressable>
                    )}
                    <StatusBar />
                    <PageTitle title={pageTitle}/>
                    <SearchBar />
                    <AddCard />
                    <View style={mainLayoutStyles.mainContent} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <StackNavigator />
                    </View>
                </View>
                
   
        </SafeAreaView>
    );
}

const mainLayoutStyles = StyleSheet.create({
    mainContent: {
        flex: 1,
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
