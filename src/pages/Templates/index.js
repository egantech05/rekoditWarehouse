import { View, Text, StyleSheet, ScrollView } from "react-native";

import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard"

export default function Templates() {
  return (
    <View style={TemplateStyles.container}>
      <SearchBar />
      <AddCard />
      <ScrollView
        contentContainerStyle={TemplateStyles.scroll}
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
    </View>
  );
}

