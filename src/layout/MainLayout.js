import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useNavigationState } from "@react-navigation/native";
import StackNavigator from "../components/navigation/StackNavigator";

import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";

import { mainStyles } from "../assets/styles";
import Header from "./Header";
import NavBar from "../components/NavBar";
import WarehouseSelection from "../components/WarehouseSelection";
import StatusBar from "../components/StatusBar"
import PageTitle from "../components/PageTitle";
import { colors } from "../assets/styles";


export default function MainLayout({ routeName, onLogout }) {

    const pageTitleByRoute = {
    Home: "Inventory",
    Templates: "Inventory Template",
    Team: "Team",
    };

    const pageTitle = pageTitleByRoute[routeName] ?? "";

    const [panel, setPanel] = useState(null);

    const { user } = useAuth();
    const [warehouseConnected, setWarehouseConnected] = useState(true);
    const [warehouseName, setWarehouseName] = useState("");

    useEffect(() => {
        let ignore = false;

        const refreshWarehouseConnected = async () => {
            if (!user?.id) {
                setWarehouseConnected(false);
                setWarehouseName("");
                return;
            }
            
            const { data, error } = await supabase
                .from("warehouses")
                .select("id, name, created_at")
                .order("created_at", { ascending: false })
                .limit(1);
            
            if (ignore) return;
            
            if (error) {
                console.warn("loadWarehouses failed:", error);
                return;
            }
            

            const latestWarehouse = (data ?? [])[0] ?? null;
            setWarehouseConnected(!!latestWarehouse);
            setWarehouseName(latestWarehouse?.name ?? "");
        };

        refreshWarehouseConnected();

        const channel = supabase
            .channel("warehouses-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "warehouses" },
                refreshWarehouseConnected
            )
            .subscribe();

        return () => {
            ignore = true;
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    const hasNoWarehouses = warehouseConnected === false;

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
                                {panel === "nav" && <NavBar onWarehousePress={handleWarehousePress} onClose={closePanels} onLogout={onLogout} warehouseConnected={warehouseConnected} warehouseName={warehouseName}/>}
                                {panel === "warehouse" && <WarehouseSelection />}
                            </Pressable>
                        </Pressable>
                    )}
                    {!hasNoWarehouses && <StatusBar />}
                    {!hasNoWarehouses && <PageTitle title={pageTitle}/>}
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
