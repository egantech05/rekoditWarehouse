import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const ViewModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.8)",
        
     
      },
      sheet: {
        backgroundColor: colors.bright,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight:"80%",
        minHeight:"80%",
    
      },

      header:{
        borderBottomWidth:1,
        borderColor:colors.brightOutline,
        padding:16,
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems: "center",
      },


      headerText:{
        fontSize:16,
        fontWeight:"bold",
        color:colors.boldColor,

      },



      body:{
        flex:1,
        
      },

      footer:{
       
        justifyContent:"flex-end",
        borderTopWidth: 1,
        padding:16,
        borderColor:colors.brightOutline,
        flexDirection: "row",
        gap: 8,
      },



});