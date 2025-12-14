import { useNavigation } from "@react-navigation/native";

import { colors } from "../../assets/styles"
import MenuBar from "../MenuBar"


export default function NavBar({ onWarehousePress = () => {}, onClose = () => {} }) {
    
  const navigation = useNavigation();
  const closeThen = (fn) => () => { onClose(); fn?.(); };
  const navItems = [
    { key: "warehouse", label: "Warehouse", icon: { name: "sync-outline", color: colors.brandHighlight }, onPress: onWarehousePress, textStyle: { color: colors.brandHighlight } },
    { key: "home", label: "Home", icon: { name: "home-outline", color: "white" }, onPress:closeThen(() => navigation.navigate("Home")) },
    { key: "template", label: "Inventory Template", icon: { name: "document-text-outline", color: "white" }, onPress:closeThen(() => navigation.navigate("Templates")) },
    { key: "team", label: "Team", icon: { name: "people-outline", color: "white" }, onPress: closeThen(() => navigation.navigate("Team"))},
    { key: "logout", label: "Logout", icon: { name: "log-out-outline", color: "white" }, backgroundColor: "#B63D3F" },
  ];
  return <MenuBar items={navItems} />;
};