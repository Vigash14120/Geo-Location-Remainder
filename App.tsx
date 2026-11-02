import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation';
import { notificationService } from './src/services/notifications';
import { backgroundTaskService } from './src/services/backgroundTasks';
import * as Location from 'expo-location';

export default function App() {
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // 1. Register Notifications and setup notification channel
        await notificationService.registerNotifications();

        // 2. Request Location permissions and register background tracking
        const foregroundStatus = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus.status === 'granted') {
          try {
            const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus.status === 'granted') {
              await backgroundTaskService.registerBackgroundTask();
            }
          } catch (bgErr) {
            console.log('Background location permission optional or deferred:', bgErr);
          }
        }
      } catch (error) {
        console.error('Error during app service initialization:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
