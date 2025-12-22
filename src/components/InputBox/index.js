import { View, Text, TextInput } from "react-native";
import { DropDownStyles } from "./styles";

import { InputBoxStyles } from "./styles";

export default function InputBox ({title}){
    return(
        <View style={InputBoxStyles.container}>
             <Text style={InputBoxStyles.title}>{title}</Text>
             <TextInput style={InputBoxStyles.input}></TextInput>

        </View>
    );
};
