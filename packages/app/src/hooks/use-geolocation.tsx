import { useCallback, useState } from "react";

import { Coordinates } from "../lib/models";
import { postJSON } from "../lib/utils";

export type GeoLocationResults = {
  capture: () => void
  coords: GeolocationCoordinates
  error: string
}

export const useGeolocation = (consent: boolean) => {
  const [coords, setCoords] = useState<GeolocationCoordinates>(null);
  const [error, setError] = useState(null);

  const success: PositionCallback = (location) => {
    const { latitude, longitude } = location.coords;
    setCoords(location.coords);
    postJSON<Partial<Coordinates>>('/api/my/location', {
      coordinates: [longitude, latitude],
    }).catch(console.error)
  };

  const fail: PositionErrorCallback = (error) => {
    setError(error.message);
  };

  const capture = useCallback(() => {
    if (!navigator.geolocation || !consent) return
    navigator.geolocation.getCurrentPosition(success, fail);
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, fail);
    }, 60000 * 5);

    return () => clearInterval(interval);
  }, [consent]);

  return {
    capture,
    coords,
    error
  } as GeoLocationResults;
}


