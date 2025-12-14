import { colors } from "../../assets/styles"
import MenuBar from "../MenuBar"

const navItems = (onWarehousePress, lastBarColor = "#B63D3F") => [
    { key: "warehouse", label: "Warehouse", icon: { name: "sync-outline", color: colors.brandHighlight }, onPress: onWarehousePress, textStyle: { color: colors.brandHighlight } },
    { key: "template", label: "Inventory Template", icon: { name: "document-text-outline", color: "white" } },
    { key: "team", label: "Team", icon: { name: "people-outline", color: "white" } },
    { key: "logout", label: "Logout", icon: { name: "log-out-outline", color: "white" }, backgroundColor: lastBarColor },
];

export default function NavBar({ onWarehousePress = () => { }, lastBarColor }) {
    return <MenuBar items={navItems(onWarehousePress, lastBarColor)} />;
}

