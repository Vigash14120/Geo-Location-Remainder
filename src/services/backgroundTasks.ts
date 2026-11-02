import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { storageService } from './storage';
import { getHaversineDistance, isWithinTimeRange } from '../utils/geo';
import { notificationService } from './notifications';
import { Reminder } from '../types';

export const LOCATION_TASK_NAME = 'background-location-task';

/**
 * Evaluates active reminders against a given coordinate and triggers notifications if matched.
 */
export async function evaluateRemindersAtLocation(coords: {
  latitude: number;
  longitude: number;
  altitude?: number | null;
}): Promise<void> {
  const { latitude, longitude, altitude } = coords;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return;
  }

  const reminders = await storageService.getReminders();
  const activeReminders = reminders.filter((r) => r.isEnabled && !r.isTriggered);

  for (const reminder of activeReminders) {
    const distance = getHaversineDistance(
      { latitude, longitude },
      { latitude: reminder.location.latitude, longitude: reminder.location.longitude }
    );

    let altitudeOk = true;
    if (
      reminder.location.altitude !== undefined &&
      !isNaN(reminder.location.altitude) &&
      altitude !== null &&
      altitude !== undefined &&
      !isNaN(altitude)
    ) {
      const altDist = Math.abs(altitude - reminder.location.altitude);
      altitudeOk = altDist <= (reminder.altitudeThreshold || 10);
    }

    let timeOk = true;
    if (reminder.timeConditions?.startTime && reminder.timeConditions?.endTime) {
      timeOk = isWithinTimeRange(reminder.timeConditions.startTime, reminder.timeConditions.endTime);
    }

    if (distance <= reminder.radius && altitudeOk && timeOk) {
      // Trigger notification
      await notificationService.sendReminderNotification(reminder);

      // Mark as triggered to avoid repeating notification
      reminder.isTriggered = true;
      await storageService.updateReminder(reminder);
    }
  }
}

export const backgroundTaskService = {
  async registerBackgroundTask(): Promise<void> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (!isRegistered) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 seconds
          distanceInterval: 10, // 10 meters
          deferredUpdatesInterval: 30000,
          deferredUpdatesDistance: 25,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Geo-Reminder is Active',
            notificationBody: 'Monitoring your location for reminders.',
            notificationColor: '#2563eb',
          },
        });
        console.log('Background location task registered successfully');
      }
    } catch (e) {
      console.error('Failed to register background location task:', e);
    }
  },

  async unregisterBackgroundTask(): Promise<void> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log('Background location task unregistered');
      }
    } catch (e) {
      console.error('Failed to unregister background location task:', e);
    }
  },
};

// Define the background task in global scope
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background task location error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations?: Location.LocationObject[] };
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return;
    }
    // Take the newest/latest location point from the batch
    const latestLocation = locations[locations.length - 1];
    if (latestLocation && latestLocation.coords) {
      await evaluateRemindersAtLocation(latestLocation.coords);
    }
  }
});
