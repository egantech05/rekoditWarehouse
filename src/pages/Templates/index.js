import { View, Text, StyleSheet, ScrollView } from "react-native";

import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"

export default function Templates() {
  return (
    <ScrollView
      contentContainerStyle={TemplateStyles.container}
      showsVerticalScrollIndicator={false}
    >
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        <TemplateDisplayCard/>
        
    </ScrollView>
  );
}

