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
    // 渋谷、東京の固定位置
    const shibuyaLocation = {
      lat: 35.6580,
      lng: 139.7016
    };
    
    // 位置情報の代わりに固定位置を使用
    setState({
      loading: false,
      error: null,
      position: shibuyaLocation,
    });
    
    // 元の位置情報コードは以下にコメントアウトされています
    /*
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
    */
  }, []);

  return state;
};