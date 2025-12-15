import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from "react";     
import { NavigationContainer,useNavigationContainerRef } from "@react-navigation/native";
import MainLayout from "./src/layout/MainLayout";


export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [routeName, setRouteName] = useState();

  const syncRoute = () => setRouteName(navigationRef.getCurrentRoute()?.name);


  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={syncRoute} onStateChange={syncRoute}>
        <MainLayout routeName={routeName} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}