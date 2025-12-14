import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainLayout from './src/layout/MainLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainLayout />
    </SafeAreaProvider>
  );
}