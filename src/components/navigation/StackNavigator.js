import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../../pages/Home";
import Templates from "../../pages/Templates";
import Team from "../../pages/Team";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Templates" component={Templates} />
      <Stack.Screen name="Team" component={Team} />
    </Stack.Navigator>
  );
}