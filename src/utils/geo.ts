import { Linking, Platform } from 'react-native';

/**
 * Default fallback coordinates: Center of District 1, Ho Chi Minh City, Vietnam
 * (as specified in Crave OSM Plan Section 3.3)
 */
export const DEFAULT_COORDINATES = {
  latitude: 10.7769,
  longitude: 106.7009,
  cityName: 'Hồ Chí Minh',
  districtName: 'Quận 1',
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 * Conforms to Section 7 of Crave plan.md
 * @returns Distance in kilometers (rounded to 1 decimal place)
 */
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Format distance into a friendly string (e.g. "450 m" or "1.5 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Calculate estimated walking or driving delivery time
 */
export function calculateDeliveryTime(distanceKm: number): string {
  if (distanceKm <= 1.0) return '10-15 mins';
  if (distanceKm <= 2.5) return '15-25 mins';
  if (distanceKm <= 5.0) return '25-35 mins';
  return '35-45 mins';
}

/**
 * Open coordinates in external map app (Google Maps on Android/Web, Apple Maps on iOS)
 * Conforms to Phase 3 of Crave plan.md
 */
export async function openInMaps(
  latitude: number,
  longitude: number,
  label?: string
): Promise<void> {
  const cleanLabel = encodeURIComponent(label || 'Restaurant');
  const url = Platform.select({
    ios: `maps:0,0?q=${cleanLabel}@${latitude},${longitude}`,
    android: `geo:0,0?q=${latitude},${longitude}(${cleanLabel})`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  });

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      );
    }
  } catch (error) {
    console.warn('Could not open map URL:', error);
  }
}

/**
 * Open native phone dialer with restaurant phone number
 */
export async function openPhone(phoneNumber: string): Promise<void> {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
  const url = `tel:${cleanPhone}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.warn('Could not open phone dialer:', error);
  }
}

/**
 * Open external website in browser
 */
export async function openWebsite(webUrl: string): Promise<void> {
  let url = webUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.warn('Could not open website URL:', error);
  }
}
