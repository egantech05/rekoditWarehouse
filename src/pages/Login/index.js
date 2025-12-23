import {View, Text, Pressable,StyleSheet} from "react-native";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";

import InputBox from "../../components/InputBox"
import Signup from "../Signup";

import {colors} from "../../assets/styles"
import FooterTextButton from "../../components/FooterTextButton";


export default function Login(){

    const [showSignup, setShowSignup] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.frame}>
                <Text style={styles.brand}>REKODIT</Text>
                <Text style={styles.title}>INVENTORY</Text>
                <InputBox title="Email"/>
                <InputBox title="Password"/>
                <Text style={styles.validationAlert}>You are not registered!</Text>
                <Text style={styles.validationAlert}>Wrong password!</Text>
                <Pressable style={styles.forgotPass}><Text style={styles.forgotPassText}>Forgot Password?</Text></Pressable>
                <View style={styles.buttonRow}>
                    <FooterTextButton text="Login" textColor={colors.brandHighlight} color={colors.boldColor} />
                </View>
                <Pressable style={styles.signUp} onPress={()=> setShowSignup(true)} >
                    <Text style={styles.signUpText}>No account? Signup here!</Text>
                </Pressable>
            </View>
            <View style={styles.company}><Text style={styles.companyText}>by EGANTECH</Text></View>
            <Signup visible={showSignup} onClose={() => setShowSignup(false)} />

        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.body,
        padding: 16,
        justifyContent: "center",  
        alignItems: "center",    
    },

    frame:{
        width:"90%",
        flex:1,
        justifyContent: "center",
        
    },

    brand:{
        color: colors.brandHighlight,
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center", 
    },

    title:{
        color: colors.bright,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },

    forgotPass:{
        margin:8,
        marginBottom: 16,
        alignSelf: "flex-end", 
    },

    forgotPassText:{
        color: "white",
    },

    validationAlert:{
        color: colors.red,
        marginLeft: 18,
        marginTop:8,
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 16,
      },

    signUp:{
        marginVertical: 24,
        alignSelf: "center",

    },

    signUpText:{
        color: "white",
     
    },

    company:{
        
    },

    companyText:{
        color: colors.bright,
    },
});