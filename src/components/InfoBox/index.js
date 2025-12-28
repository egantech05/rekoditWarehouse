import { View, Text } from "react-native";
import { DropDownStyles } from "./styles";

import { InfoBoxStyles } from "./styles";

export default function InputBox ({title,value}){
    return(
        <View style={InfoBoxStyles.container}>
             <Text style={InfoBoxStyles.title}>{title}</Text>
             <Text style={InfoBoxStyles.input}>{value}</Text>

        </View>
    );
};
