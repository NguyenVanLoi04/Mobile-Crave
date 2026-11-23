import * as Location from 'expo-location';
import { DEFAULT_COORDINATES } from '../../utils/geo';
import { nominatimService } from '../osm/nominatimService';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UserLocationResult {
  coords: LocationCoords;
  isPermissionGranted: boolean;
  isFallback: boolean;
  district?: string;
  city?: string;
  formattedAddress?: string;
}

/**
 * Fallback location: Trung tâm Quận 1, TP. Hồ Chí Minh
 * (Dùng khi người dùng từ chối quyền GPS hoặc thiết bị không hỗ trợ)
 */
export const FALLBACK_LOCATION: UserLocationResult = {
  coords: {
    latitude: DEFAULT_COORDINATES.latitude, // 10.7769
    longitude: DEFAULT_COORDINATES.longitude, // 106.7009
  },
  isPermissionGranted: false,
  isFallback: true,
  district: 'Bến Nghé, Quận 1',
  city: 'TP. Hồ Chí Minh',
  formattedAddress: 'Bến Nghé, Quận 1, TP. Hồ Chí Minh',
};

class LocationService {
  private cachedLocation: UserLocationResult | null = null;

  /**
   * Lấy vị trí GPS thực tế động của thiết bị
   * Tự động Reverse Geocode thành địa chỉ đường / phường / quận / thành phố
   */
  async getCurrentLocation(): Promise<UserLocationResult> {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    try {
      // 1. Kiểm tra & Yêu cầu quyền truy cập GPS
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('LocationService: Permission not granted, using fallback.');
        return FALLBACK_LOCATION;
      }

      // 2. Lấy toạ độ GPS chính xác
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 3. Reverse Geocode để lấy địa chỉ thân thiện
      let formattedAddress = 'TP. Hồ Chí Minh';
      let district: string | undefined;
      let city = 'TP. Hồ Chí Minh';

      try {
        // Thử reverse geocode bằng Expo native
        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          district = addr.district || addr.subregion || undefined;
          city = addr.city || addr.region || 'TP. Hồ Chí Minh';

          const parts: string[] = [];
          if (addr.streetNumber && addr.street) {
            parts.push(`${addr.streetNumber} ${addr.street}`);
          } else if (addr.street) {
            parts.push(addr.street);
          } else if (addr.name) {
            parts.push(addr.name);
          }

          if (district) parts.push(district);
          if (city && !parts.includes(city)) parts.push(city);

          if (parts.length > 0) {
            formattedAddress = parts.join(', ');
          }
        }
      } catch (nativeGeoErr) {
        // Fallback sang Nominatim reverse geocode nếu native không khả dụng
        try {
          const nom = await nominatimService.reverseGeocode(latitude, longitude);
          if (nom?.address) {
            const nomAddr = nom.address;
            district = nomAddr.suburb || nomAddr.quarter || nomAddr.city_district || nomAddr.district;
            city = nomAddr.city || nomAddr.state || 'TP. Hồ Chí Minh';
            const street = nomAddr.road || nomAddr.pedestrian;
            const parts: string[] = [];
            if (street) parts.push(street);
            if (district) parts.push(district);
            if (city) parts.push(city);
            if (parts.length > 0) formattedAddress = parts.join(', ');
          }
        } catch {
          // Ignore
        }
      }

      const result: UserLocationResult = {
        coords: { latitude, longitude },
        isPermissionGranted: true,
        isFallback: false,
        district,
        city,
        formattedAddress,
      };

      this.cachedLocation = result;
      return result;
    } catch (error) {
      console.warn('LocationService error getting position:', error);
      return FALLBACK_LOCATION;
    }
  }

  /**
   * Xóa cache để ép buộc lấy lại toạ độ GPS mới nhất
   */
  clearCache(): void {
    this.cachedLocation = null;
  }
}

export const locationService = new LocationService();
