import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    lat: number;
    lng: number;
  } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  useEffect(() => {

    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'お使いのブラウザは位置情報をサポートしていません',
        position: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error: `位置情報を取得できませんでした: ${error.message}`,
          position: null,
        });
      }
    );
  }, []);

  return state;
};