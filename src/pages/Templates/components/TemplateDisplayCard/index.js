import { View, Text, Pressable } from "react-native";

import { TemplateDisplayCardStyles } from "./styles";

export default function TemplateDisplayCard (){
    return(
        <Pressable style={TemplateDisplayCardStyles.container}>
 
          
                    <Text style={TemplateDisplayCardStyles.title}>Template Name</Text>
                    <View style={TemplateDisplayCardStyles.pillList}>
                        <View style={TemplateDisplayCardStyles.pill}>
                            <Text style={TemplateDisplayCardStyles.pillText}>Prop1</Text>
                        </View>
                        <View style={TemplateDisplayCardStyles.pill}>
                            <Text style={TemplateDisplayCardStyles.pillText}>Prop2</Text>
                        </View>
                        <View style={TemplateDisplayCardStyles.pill}>
                            <Text style={TemplateDisplayCardStyles.pillText}>Properties 3</Text>
                        </View>  
                        <View style={TemplateDisplayCardStyles.pill}>
                            <Text style={TemplateDisplayCardStyles.pillText}>Properties 5</Text>
                        </View>  
                    </View>


        
        </Pressable>
    );
}