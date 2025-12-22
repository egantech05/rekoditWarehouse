import { View, ScrollView } from "react-native";
import React, { useState } from "react";

import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard"
import NewTemplateCard from "./components/NewTemplateCard";

export default function Templates() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <View style={TemplateStyles.container}>
      <SearchBar />
     <AddCard onPress={() => setShowNewTemplate(true)} />
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

      <NewTemplateCard
        visible={showNewTemplate}
        onClose={()=>setShowNewTemplate(false)}
      />
    </View>
  );
}

