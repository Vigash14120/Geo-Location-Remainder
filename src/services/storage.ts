import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types';

const STORAGE_KEY = '@geo_reminders';

export const storageService = {
  async getReminders(): Promise<Reminder[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error fetching reminders from storage:', e);
      return [];
    }
  },

  async saveReminders(reminders: Reminder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (e) {
      console.error('Error saving reminders to storage:', e);
    }
  },

  async addReminder(reminder: Reminder): Promise<void> {
    const reminders = await this.getReminders();
    await this.saveReminders([reminder, ...reminders]);
  },

  async updateReminder(updatedReminder: Reminder): Promise<void> {
    const reminders = await this.getReminders();
    const index = reminders.findIndex((r) => r.id === updatedReminder.id);
    if (index !== -1) {
      reminders[index] = updatedReminder;
      await this.saveReminders(reminders);
    }
  },

  async deleteReminder(id: string): Promise<void> {
    const reminders = await this.getReminders();
    const updated = reminders.filter((r) => r.id !== id);
    await this.saveReminders(updated);
  },

  async clearTriggeredReminders(): Promise<void> {
    const reminders = await this.getReminders();
    const updated = reminders.filter((r) => !r.isTriggered);
    await this.saveReminders(updated);
  },

  async reactivateReminder(id: string): Promise<void> {
    const reminders = await this.getReminders();
    const index = reminders.findIndex((r) => r.id === id);
    if (index !== -1) {
      reminders[index] = {
        ...reminders[index],
        isTriggered: false,
        isEnabled: true,
      };
      await this.saveReminders(reminders);
    }
  },
};
