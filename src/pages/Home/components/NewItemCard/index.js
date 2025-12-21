
import { View,Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {NewItemStyles} from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterButton from "../../../../components/FooterButton";

import {colors} from "../../../../assets/styles"
import Dropdown from "../../../../components/DropDown"
import InputBox from "../../../../components/InputBox"


export default function NewItemCard({visible, onClose}){

    const footer = (
        <>
        <FooterButton text="Save" color={colors.boldColor} textColor={colors.brandHighlight} />
        </>

    );



    return(
        <ViewModal visible={visible} onClose={onClose} title="New Inventory" footer={footer}>
            <Dropdown title="Template" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
            <InputBox title="Property 1" />
            <InputBox title="Property 2" />
      </ViewModal>
    );
};