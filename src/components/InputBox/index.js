import { View, Text, TextInput } from "react-native";
import { DropDownStyles } from "./styles";

import { InputBoxStyles } from "./styles";

export default function InputBox({
        title,
        value,
        onChangeText,
        placeholder,
        secureTextEntry,
        keyboardType,
        autoCapitalize = "none",
        autoCorrect = false,
        textContentType,
    }) {
    return(
        <View style={InputBoxStyles.container}>
             <Text style={InputBoxStyles.title}>{title}</Text>
             <TextInput
                style={InputBoxStyles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                textContentType={textContentType}
            />

        </View>
    );
};
