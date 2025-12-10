export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
}

export interface AirQualityResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    pm10: (number | null)[];
    pm2_5: (number | null)[];
    carbon_monoxide: (number | null)[];
    nitrogen_dioxide: (number | null)[];
    sulphur_dioxide: (number | null)[];
    ozone: (number | null)[];
  };
}
