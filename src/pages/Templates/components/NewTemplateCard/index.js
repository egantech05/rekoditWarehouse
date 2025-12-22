
import {ScrollView } from "react-native"; 

import {styles} from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterTextButton from "../../../../components/FooterTextButton";

import {colors} from "../../../../assets/styles"
import InputBox from "../../../../components/InputBox"


export default function NewTemplateCard({visible, onClose}){

    const footer = (
        <>
        <FooterTextButton text="Create" color={colors.boldColor} textColor={colors.brandHighlight} />
        </>

    );



    return(
        <ViewModal visible={visible} onClose={onClose} title="New Template" footer={footer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <InputBox title="Name" />
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
            </ScrollView>
      </ViewModal>
    );
};