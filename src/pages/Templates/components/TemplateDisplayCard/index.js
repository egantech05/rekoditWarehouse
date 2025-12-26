import { View, Text, Pressable, ScrollView } from "react-native";

import { TemplateDisplayCardStyles } from "./styles";

export default function TemplateDisplayCard({ onPress, title = "Template", properties = [] }) {
    return(
        <Pressable style={TemplateDisplayCardStyles.container} onPress={onPress}>
            <View style={TemplateDisplayCardStyles.spacer} />
          
            <Text style={TemplateDisplayCardStyles.title}>{title}</Text>
            {(() => {
                const pills = (Array.isArray(properties) ? properties : [])
                .map((p) => (typeof p === "string" ? p.trim() : String(p)))
                .filter(Boolean);
            
                const mid = Math.ceil(pills.length / 2);
                const row1 = pills.slice(0, mid);
                const row2 = pills.slice(mid);
            
                return (

                    <View style={TemplateDisplayCardStyles.pillList}>
                        <View style={TemplateDisplayCardStyles.pillRow}>
                            {row1.map((p, idx) => (
                            <View key={`r1-${p}-${idx}`} style={TemplateDisplayCardStyles.pill}>
                                <Text style={TemplateDisplayCardStyles.pillText} numberOfLines={1}>{p}</Text>
                            </View>
                            ))}
                        </View>
            
                        <View style={TemplateDisplayCardStyles.pillRow}>
                            {row2.map((p, idx) => (
                            <View key={`r2-${p}-${idx}`} style={TemplateDisplayCardStyles.pill}>
                                <Text style={TemplateDisplayCardStyles.pillText} numberOfLines={1}>{p}</Text>
                            </View>
                            ))}
                        </View>
                    </View>
    
                );
            })()}


        
        </Pressable>
    );
}