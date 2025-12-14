import { colors } from "../../assets/styles"
import MenuBar from "../MenuBar"

const items = (lastBarColor = "#333333") => [
    { key: "w1", label: "Warehouse", icon: { name: "sync-outline", color: colors.brandHighlight }, textStyle: { color: colors.brandHighlight } },
    { key: "w2", label: "Warehouse 2", icon: { name: "sync-outline", color: "white" } },
    { key: "w3", label: "Warehouse 3", icon: { name: "sync-outline", color: "white" } },
    { key: "w4", label: "Warehouse 2", icon: { name: "sync-outline", color: "white" } },
    { key: "w5", label: "Warehouse 3", icon: { name: "sync-outline", color: "white" } },
    { key: "new", label: "Create New", icon: { name: "add-circle-outline", color: "white" }, backgroundColor: lastBarColor },
];

export default function WarehouseSelection({ onItemPress, lastBarColor }) {
    return <MenuBar items={items(lastBarColor)} onItemPress={onItemPress} />;
}