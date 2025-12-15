import {View,Text,StyleSheet} from "react-native";

export default function PageTitle({title}){
    return(
        <View>
            <Text style={PageTitleStyle.pageTitle}>{title}</Text>
        </View>
    );
}

export const PageTitleStyle= StyleSheet.create({
    pageTitle:{
        color:"white",
        fontSize: 16,
        fontWeight: "bold",
        padding:16,
    }
});