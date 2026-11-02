export interface GeoPoint {
  latitude: number;
  longitude: number;
  altitude?: number; // Optional altitude for 3D geofencing
}

export interface Reminder {
  id: string;
  title: string;
  notes: string;
  location: GeoPoint;
  radius: number; // in meters
  isEnabled: boolean;
  isTriggered: boolean;
  timeConditions?: {
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
  };
  altitudeThreshold?: number; // Altitude match threshold in meters
  createdAt: number;
}
