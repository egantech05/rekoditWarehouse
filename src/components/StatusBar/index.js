import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { statusBarStyles } from "./styles";
import { useAuth } from "../../auth/AuthContext";
import { restRequest, restFirst } from "../../lib/supabase";



export default function StatusBar({ warehouseName: warehouseNameProp }){

    const { user, profile, loading, warehouseSelectionLoaded } = useAuth();

    const [warehouseName, setWarehouseName] = useState("");

    const displayWarehouseName = warehouseNameProp ?? warehouseName;

    useEffect(() => {
        if (warehouseNameProp != null) return;
        let ignore=false;

        const loadWarehouseName = async()=> {
            if (!user?.id){
                setWarehouseName("");
                return;
            }
            let row = null;
            try {
                const rows = await restRequest({
                    path: "warehouses",
                    params: {
                        select: "name,created_at",
                        order: "created_at.desc",
                        limit: "1",
                    },
                });
                row = restFirst(rows);
            } catch (e) {
                setWarehouseName("");
                return;
            }

            setWarehouseName(row?.name ?? "");

        };

        loadWarehouseName();

        return ()=>{
            ignore = true;
        };


    },[user?.id, warehouseNameProp]);

    return(
    <View style={statusBarStyles.container}>
        <View style={statusBarStyles.warehouse}>
            
            <Ionicons name= "folder-outline" size={16} color="white" />
            <View >
            <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
            <Text style={statusBarStyles.warehouseName} numberOfLines={1} ellipsizeMode="tail">
            {displayWarehouseName || "No warehouse"}
            </Text>

            {(loading || !warehouseSelectionLoaded) ? (
            <ActivityIndicator size="small" color="white" style={{ marginLeft: 6 }} />
            ) : null}
            </View>
            </View>
        </View>
        <View style={statusBarStyles.user}>
            <View >
            <Text style={statusBarStyles.userName} numberOfLines={1} ellipsizeMode="middle">
            {profile?.full_name || "—"}
            </Text>
            </View>
            <Ionicons name= "person-circle-outline" size={24} color="white" />
        </View>
        
    </View>

    );

}