import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import MainLayout from "./src/layout/MainLayout";


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainLayout />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}