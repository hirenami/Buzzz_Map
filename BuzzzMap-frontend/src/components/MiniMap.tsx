import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Restaurant } from "../types";
import { MapPin } from "lucide-react";
import { nameCache } from "../services/openaiService";

interface MiniMapProps {
    restaurants: Restaurant[];
    keyword: string;
    onMapClick: () => void;
}

const MiniMap: React.FC<MiniMapProps> = ({
    restaurants,
    keyword,
    onMapClick,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});

    // Initialize Google Maps
    useEffect(() => {
        const initMap = async () => {
            setIsLoading(true);

            const loader = new Loader({
                apiKey: import.meta.env.VITE_API_KEY || "",
                version: "weekly",
            });

            try {
                const google = await loader.load();

                // Default location (Shibuya, Tokyo)
                const defaultLocation = { lat: 35.658, lng: 139.7016 };

                // If we have restaurants, center on the first one
                const initialCenter =
                    restaurants.length > 0
                        ? { lat: restaurants[0].lat, lng: restaurants[0].lng }
                        : defaultLocation;

                const mapOptions = {
                    center: initialCenter,
                    zoom: 15, // Higher zoom level (15-16 is approximately 1km radius)
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    zoomControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    scrollwheel: false, // Disable scrollwheel to prevent scrolling issues
                    disableDefaultUI: true,
                    gestureHandling: "cooperative", // Prevents the map from capturing all touch events
                    styles: [
                        {
                            featureType: "all",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#7c93a3" }, { lightness: -10 }],
                        },
                        {
                            featureType: "administrative.country",
                            elementType: "geometry",
                            stylers: [{ visibility: "on" }],
                        },
                        {
                            featureType: "administrative.country",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#a0a4a5" }],
                        },
                        {
                            featureType: "administrative.province",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#62838e" }],
                        },
                        {
                            featureType: "landscape",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#f5f5f5" }],
                        },
                        {
                            featureType: "landscape.man_made",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#f5f5f5" }],
                        },
                        {
                            featureType: "landscape.natural",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#f5f5f5" }],
                        },
                        {
                            featureType: "landscape.natural.terrain",
                            elementType: "geometry.fill",
                            stylers: [{ visibility: "off" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.attraction",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.business",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.government",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.medical",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry.fill",
                            stylers: [
                                { color: "#dcebd7" },
                                { visibility: "on" },
                            ],
                        },
                        {
                            featureType: "poi.place_of_worship",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.school",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "poi.sports_complex",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#e8e8e8" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#ffffff" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#dfdfdf" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#ffffff" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#dfdfdf" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry.fill",
                            stylers: [{ color: "#cad2d6" }],
                        },
                    ],
                };

                if (mapRef.current) {
                    const newMap = new google.maps.Map(
                        mapRef.current,
                        mapOptions
                    );
                    setMap(newMap);
                    setIsLoading(false);

                    // Add click event to the map
                    newMap.addListener("click", () => {
                        onMapClick();
                    });
                }
            } catch (error) {
                console.error("Google Mapsの読み込みエラー:", error);
                setIsLoading(false);
            }
        };

        if (!map) {
            initMap();
        }
    }, [onMapClick, restaurants]);

    // Update map center when restaurants change
    useEffect(() => {
        if (map && restaurants.length > 0) {
            // Center on the first restaurant
            map.setCenter({
                lat: restaurants[0].lat,
                lng: restaurants[0].lng,
            });
        }
    }, [map, restaurants]);

    // Add markers for restaurants
    useEffect(() => {
        if (!map || !restaurants.length) return;

        // Keep track of current restaurant IDs
        const currentRestaurantIds = new Set(restaurants.map((r) => r.id));

        // Remove markers that are no longer in the restaurants array
        Object.keys(markersRef.current).forEach((id) => {
            if (!currentRestaurantIds.has(id)) {
                markersRef.current[id].setMap(null);
                delete markersRef.current[id];
            }
        });

        // Create or update markers
        restaurants.forEach((restaurant) => {
            // If marker already exists, just update its position
            if (markersRef.current[restaurant.id]) {
                markersRef.current[restaurant.id].setPosition({
                    lat: restaurant.lat,
                    lng: restaurant.lng,
                });
            } else {
                // Get color based on trend keyword
                const getCategoryColor = (keyword: string): string => {
                    const colorMap: Record<string, string> = {
                        抹茶ラテ: "#4CAF50", // Green
                        ビリアタコス: "#FF9800", // Orange
                        スマッシュバーガー: "#F44336", // Red
                        タピオカミルクティー: "#9C27B0", // Purple
                        ナッシュビルホットチキン: "#FF5722", // Deep Orange
                        サワードウブレッド: "#795548", // Brown
                        オーツミルク: "#8BC34A", // Light Green
                        韓国焼肉: "#E91E63", // Pink
                        ナチュラルワイン: "#673AB7", // Deep Purple
                        プラントベースバーガー: "#009688", // Teal
                    };

                    return colorMap[keyword] || "#2196F3"; // Default blue
                };

                const markerColor = getCategoryColor(restaurant.trendKeyword);

                // Format rating to show one decimal place
                const formattedRating = restaurant.rating.toFixed(1);

                // Create pin SVG with rating number with one decimal place
                const pinSVG = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
            <path d="M12,0C5.4,0,0,5.4,0,12c0,7.2,12,24,12,24s12-16.8,12-24C24,5.4,18.6,0,12,0z" fill="${markerColor}" filter="url(#shadow)"/>
            <circle cx="12" cy="12" r="8" fill="white" opacity="0.4"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
            <text x="12" y="15" font-family="Arial" font-size="7" font-weight="bold" text-anchor="middle" fill="${markerColor}">${formattedRating}</text>
          </svg>
        `;

                // Convert SVG to data URL
                const svgUrl =
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(pinSVG);

                const marker = new google.maps.Marker({
                    position: { lat: restaurant.lat, lng: restaurant.lng },
                    map,
                    title: restaurant.name,
                    optimized: true,
                    icon: {
                        url: svgUrl,
                        scaledSize: new google.maps.Size(24, 36),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(12, 36),
                    },
                });

                // Store the marker in our ref
                markersRef.current[restaurant.id] = marker;
            }
        });

        // Fit bounds to include all markers with a padding
        if (Object.keys(markersRef.current).length > 0) {
            // If there's only one restaurant, set a fixed zoom level
            if (restaurants.length === 1) {
                map.setCenter({
                    lat: restaurants[0].lat,
                    lng: restaurants[0].lng,
                });
                map.setZoom(16); // Close zoom for single restaurant
            } else {
                // For multiple restaurants, fit bounds but limit zoom
                const bounds = new google.maps.LatLngBounds();

                // Add padding to the bounds to ensure markers aren't at the edge
                const padding = { top: 30, right: 30, bottom: 30, left: 30 };

                // Add each marker position to the bounds
                Object.values(markersRef.current).forEach((marker) => {
                    bounds.extend(marker.getPosition()!);
                });

                // Apply the bounds with padding
                map.fitBounds(bounds, padding);

                // Set a minimum zoom level to ensure we don't zoom out too far
                const listener = google.maps.event.addListener(
                    map,
                    "idle",
                    () => {
                        if (map.getZoom()! > 16) {
                            map.setZoom(16);
                        } else if (map.getZoom()! < 14) {
                            map.setZoom(14); // Don't zoom out too far
                        }
                        google.maps.event.removeListener(listener);
                    }
                );
            }
        }
    }, [map, restaurants]);

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md">
            <div ref={mapRef} className="w-full h-full" />

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-gray-700 text-sm">
                            地図を読み込み中...
                        </p>
                    </div>
                </div>
            )}

            {/* Overlay to indicate the map is clickable */}
            <div
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-colors flex items-center justify-center cursor-pointer"
                onClick={onMapClick}
            >
                <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg transform translate-y-16 hover:translate-y-0 transition-transform">
                    <div className="flex items-center text-xs text-blue-600 font-medium px-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>マップを拡大</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniMap;
