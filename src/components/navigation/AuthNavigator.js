
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Landing from "../../pages/Landing";
import Login from "../../pages/Login";
import PublicItem from "../../pages/PublicItem";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PublicItem" component={PublicItem} />
    </Stack.Navigator>
  );
}