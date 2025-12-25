import {View, Text, Pressable,StyleSheet} from "react-native";
import { useEffect, useState } from "react";


import InputBox from "../../components/InputBox"
import Signup from "../Signup";

import {colors} from "../../assets/styles"
import FooterTextButton from "../../components/FooterTextButton";
import { useAuth } from "../../auth/AuthContext";


export default function Login(){
    const { signIn } = useAuth();

    const [showSignup, setShowSignup] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!showSignup) setError("");
    }, [showSignup]);
    
    const onLogin = async () => {
        setError("");
    
        if (!email || !password) {
          setError("Please enter email and password!");
          return;
        }
    
        setLoading(true);
        try {
          await signIn(email.trim(), password);

        } catch (e) {
          const msg = e?.message ?? "Login failed!";
          if (msg.toLowerCase().includes("email not confirmed")) {
            setError("Please confirm your email before logging in!");
          } else if (msg.toLowerCase().includes("invalid login credentials")) {
            setError("Wrong email or password!");
          } else {
            setError(msg);
          }
        } finally {
          setLoading(false);
        }
      }; 

    return (
        <View style={styles.container}>
            <View style={styles.frame}>
                <Text style={styles.brand}>REKODIT</Text>
                <Text style={styles.title}>INVENTORY</Text>

                <InputBox
                    title="Email"
                    value={email}
                    onChangeText={(t) => {
                        setEmail(t);
                        if (error) setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
   
                />

                <InputBox
                    title="Password"
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t);
                        if (error) setError("");
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                />
                {error ? <Text style={styles.validationAlert}>{error}</Text> : null}

                <Pressable style={styles.forgotPass} onPress={() => setError("Forgot password not wired yet.")}>
                 <Text style={styles.forgotPassText}>Forgot Password?</Text>
                </Pressable>

                <View style={styles.buttonRow}>
                    <FooterTextButton
                        text={loading ? "Logging in..." : "Login"}
                        textColor={colors.brandHighlight}
                        color={colors.boldColor}
                        onPress={onLogin}
                        disabled={loading}
                    />
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