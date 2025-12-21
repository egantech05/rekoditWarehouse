import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";

import { HomeStyles } from "./styles";

import NewItemCard from "./components/NewItemCard"
import AddCard from "../../components/AddCard"
import ItemDisplayCard from "./components/ItemDisplayCard"
import SearchBar from "../../components/SearchBar"
import ViewItem from "./components/ViewItem"

export default function Home() {
  const [showNewItem, setShowNewItem] = useState(false);
  const [showItem, setShowItem] = useState(false);
  return (
    <View style={HomeStyles.container}>
      <SearchBar />
      <AddCard onPress={() => setShowNewItem(true)} />
      <ScrollView
        contentContainerStyle={HomeStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
          <ItemDisplayCard onPress={() => setShowItem(true)}/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
          <ItemDisplayCard/>
      </ScrollView>

      <NewItemCard
      visible={showNewItem}
      onClose={() => setShowNewItem(false)}
      />
      <ViewItem
        visible={showItem}
        onClose={() => setShowItem(false)}
      />
    </View>



    


    
  );
}

