import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from "react"; 
import { NavigationContainer,useNavigationContainerRef } from "@react-navigation/native";

import MainLayout from "./src/layout/MainLayout";
import AuthNavigator from "./src/components/navigation/AuthNavigator";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";

import { AppState } from "react-native";
import { supabase } from "./src/lib/supabase";


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
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
  
    const onActive = async () => {
      supabase.auth.startAutoRefresh();
      await supabase.auth.getSession(); 
    };
  
    window.addEventListener("focus", onActive);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onActive();
    });
  
    return () => {
      window.removeEventListener("focus", onActive);
    };
  }, []);
  

  useEffect(() => {
    supabase.auth.startAutoRefresh();
  
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
  
    return () => {
      sub.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}