import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from "react";     
import { NavigationContainer,useNavigationContainerRef } from "@react-navigation/native";

import MainLayout from "./src/layout/MainLayout";
import AuthNavigator from "./src/components/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";


function AppNavigation() {
  const navigationRef = useNavigationContainerRef();
  const [routeName, setRouteName] = useState();
  const { isLoggedIn, logout } = useAuth();

  const syncRoute = () => setRouteName(navigationRef.getCurrentRoute()?.name);

  return (
    <NavigationContainer ref={navigationRef} onReady={syncRoute} onStateChange={syncRoute}>
      {isLoggedIn ? (
        <MainLayout routeName={routeName} onLogout={logout} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}