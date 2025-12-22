
import {ScrollView,StyleSheet,View,Pressable } from "react-native"; 
import { Ionicons } from "@expo/vector-icons";

import ViewModal from "../../../../components/ViewModal"
import FooterTextButton from "../../../../components/FooterTextButton";

import {colors} from "../../../../assets/styles"
import InfoBox from "../../../../components/InfoBox"


export default function ViewTemplate({visible, onClose}){

    const footer = (
        <>

        </>

    );
    
    const tabs = (
        <View style={styles.tabs}>
            <Pressable style={styles.button}>
               <Ionicons name="trash-outline" size={24} color={colors.red} />
            </Pressable>
            <Pressable style={styles.button}>
               <Ionicons name="create-outline" size={24} color={colors.greyText} />
            </Pressable>
        </View>
    );


    return(
        <ViewModal visible={visible} onClose={onClose} title="Template 1" tabs ={tabs} footer={footer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <InfoBox title="Property 1" value="Value 1" />
                <InfoBox title="Property 1" value="Value 1" />
                <InfoBox title="Property 1" value="Value 1" />
                <InfoBox title="Property 1" value="Value 1" />

            </ScrollView>
      </ViewModal>
    );
};

const styles = StyleSheet.create({
    container:{
        padding:16,
    },

    tabs:{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.brightDarker,
        flexDirection: "row",
        justifyContent:"flex-end",
        gap: 8,
      },

      button:{
        backgroundColor: "white",
        borderRadius: 8,   
        paddingVertical:8,
        paddingHorizontal:16,
      },

});