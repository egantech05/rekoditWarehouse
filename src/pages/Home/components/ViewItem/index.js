import { View, Text, Pressable } from "react-native";

import { ViewItemStyles } from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterButton from "../../../../components/FooterButton";

import {colors} from "../../../../assets/styles"

export default function ViewItem({visible, onClose}){
    const footer = (
        <>
            <FooterButton text="Save" color={colors.boldColor} textColor={colors.brandHighlight} />
        </>
    
    );
    
    return(
        <ViewModal visible={visible} onClose={onClose}   title="Inventory 1" footer={footer}>
            <View>x</View>
        </ViewModal>
    );
};