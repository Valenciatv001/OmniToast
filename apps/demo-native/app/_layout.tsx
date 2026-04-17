import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@modal-toast/native';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider defaultPosition="top" topOffset={60} maxToasts={4}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
