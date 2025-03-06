import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Restaurant, MapOptions } from "../types";

interface MapProps {
    restaurants: Restaurant[];
    center: { lat: number; lng: number };
    onMarkerClick?: (restaurant: Restaurant) => void;
    activeKeyword: string | null;
    showCategoryLabels?: boolean;
}

const Map: React.FC<MapProps> = ({
    restaurants,
    center,
    onMarkerClick,
    activeKeyword,
    showCategoryLabels = false,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [, setMarkers] = useState<google.maps.Marker[]>([]);
    const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
        null
    );
    const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
    const [activeInfoWindow, setActiveInfoWindow] = useState<string | null>(
        null
    );
    // Initialize Google Maps
    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_API_KEY || "",
                version: "weekly",
            });

            try {
                const google = await loader.load();

                const mapOptions: MapOptions = {
                    center,
                    zoom: 14,
                    mapTypeControl: false, // Disable map type controls (satellite/map toggle)
                    fullscreenControl: false, // Disable fullscreen control
                    streetViewControl: false, // Disable street view control
                    zoomControl: false, // Disable zoom controls
                    mapTypeId: google.maps.MapTypeId.ROADMAP, // Force roadmap view
                    panControl: false, // Disable pan control
                    rotateControl: false, // Disable rotate control
                    scaleControl: false, // Disable scale control
                    scrollwheel: true, // Allow scrollwheel zoom
                    disableDefaultUI: true, // Disable all default UI controls
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

                    // Create a custom info window
                    const newInfoWindow = new google.maps.InfoWindow({
                        pixelOffset: new google.maps.Size(0, -30),
                        maxWidth: 250,
                        disableAutoPan: false,
                    });

                    setInfoWindow(newInfoWindow);

                    // Close info window when map is clicked
                    newMap.addListener("click", () => {
                        newInfoWindow.close();
                        setActiveInfoWindow(null);
                    });
                }
            } catch (error) {
                console.error("Google Mapsの読み込みエラー:", error);
            }
        };

        if (!map) {
            initMap();
        }
    }, [center, map]);

    // Update map center when center prop changes
    useEffect(() => {
        if (map) {
            map.setCenter(center);
        }
    }, [center, map]);

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
        restaurants.forEach((restaurant, index) => {
            // If marker already exists, just update its position
            if (markersRef.current[restaurant.id]) {
                markersRef.current[restaurant.id].setPosition({
                    lat: restaurant.lat,
                    lng: restaurant.lng,
                });

                // Update marker icon if needed (when activeKeyword changes)
                updateMarkerIcon(
                    markersRef.current[restaurant.id],
                    restaurant,
                    activeKeyword,
                    index,
                    showCategoryLabels
                );
            } else {
                // Create new marker with custom icon if needed
                const marker = new google.maps.Marker({
                    position: { lat: restaurant.lat, lng: restaurant.lng },
                    map,
                    title: restaurant.name,
                    optimized: true,
                    zIndex: 1,
                });

                // Set the appropriate icon
                updateMarkerIcon(
                    marker,
                    restaurant,
                    activeKeyword,
                    index,
                    showCategoryLabels
                );

                // Add click event to marker
                marker.addListener("click", () => {
                    // Show info window
                    if (infoWindow) {
                        // Close any open info window
                        infoWindow.close();

                        // Create info window content
                        const content = document.createElement("div");
                        content.className = "p-2";
                        content.innerHTML = `
              <div class="flex flex-col">
                <div class="relative">
                  <img src="${restaurant.photo_url}" alt="${
                            restaurant.name
                        }" class="w-full h-32 object-cover rounded-lg mb-2" />
                  <div class="absolute top-0 left-0 px-2 py-1 bg-opacity-70 bg-black text-white text-xs font-semibold rounded-br-lg">
                    ${restaurant.rating} <span class="ml-1">⭐</span>
                  </div>
                </div>
                <h3 class="font-semibold text-lg text-gray-800">${
                    restaurant.name
                }</h3>
                <p class="text-sm text-gray-600 mt-1">${restaurant.address}</p>
                <div class="mt-2 flex items-center">
                  <div class="flex items-center">
                    ${Array(5)
                        .fill(0)
                        .map(
                            (_, i) =>
                                `<svg class="w-3 h-3 ${
                                    i < restaurant.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                }" 
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>`
                        )
                        .join("")}
                  </div>
                  <div class="ml-2 text-gray-600">
                ${(() => {
                    switch (restaurant.price_level) {
                        case 0:
                            return `<span class="text-sm">低価格</span>`;
                        case 1:
                            return `<span class="text-sm">やや低価格</span>`;
                        case 2:
                            return `<span class="text-sm">標準価格</span>`;
                        case 3:
                            return `<span class="text-sm">やや高価格</span>`;
                        case 4:
                            return `<span class="text-sm">高価格</span>`;
                        default:
                            return null;
                    }
                })()}
              </div>
                </div>
                <div class="mt-2">
                  <button class="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-full transition-colors shadow-sm w-full" data-action="details">
                    詳細を見る
                  </button>
                </div>
              </div>
            `;

                        // Add click event to the "詳細を見る" button
                        setTimeout(() => {
                            const detailButton = content.querySelector(
                                'button[data-action="details"]'
                            );
                            if (detailButton) {
                                detailButton.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    if (onMarkerClick) {
                                        onMarkerClick(restaurant);
                                        infoWindow.close();
                                    }
                                });
                            }
                        }, 0);

                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
                        setActiveInfoWindow(restaurant.id);
                    }
                });

                // Store the marker in our ref
                markersRef.current[restaurant.id] = marker;
            }
        });

        // Update markers state for cleanup
        setMarkers(Object.values(markersRef.current));

        // Fit bounds to include all markers (only on initial load or significant changes)
        if (
            Object.keys(markersRef.current).length > 0 &&
            restaurants.length > 0
        ) {
            const bounds = new google.maps.LatLngBounds();
            Object.values(markersRef.current).forEach((marker) => {
                bounds.extend(marker.getPosition()!);
            });
            map.fitBounds(bounds);

            // Don't zoom in too far
            if (map.getZoom()! > 16) {
                map.setZoom(16);
            }
        }

        return () => {
            // Cleanup is handled by the marker tracking system
        };
    }, [
        map,
        infoWindow,
        onMarkerClick,
        restaurants,
        activeKeyword,
        showCategoryLabels,
    ]);

    // Helper function to create custom marker with label
    const updateMarkerIcon = (
        marker: google.maps.Marker,
        restaurant: Restaurant,
        activeKeyword: string | null,
        index: number,
        showCategoryLabels: boolean
    ) => {
        const colorList = [
            "#4CAF50", // Green
            "#FF9800", // Orange
            "#F44336", // Red
            "#9C27B0", // Purple
            "#FF5722", // Deep Orange
            "#795548", // Brown
            "#8BC34A", // Light Green
            "#E91E63", // Pink
            "#673AB7", // Deep Purple
            "#009688", // Teal
            // 他にも色を追加可能
        ];

        // キーワードごとに色を割り当てる
        const getCategoryColor = (index: number): string => {
            // 色リストのインデックスに基づいて色を取得（順番に割り当て）
            return colorList[index % colorList.length]; // 配列の長さを超えたら再利用
        };

        // Calculate vertical offset to prevent overlapping labels
        const labelOriginY = index % 2 === 0 ? 35 : 45;

        // Format rating to show one decimal place
        const formattedRating = restaurant.rating.toFixed(1);

        if (activeKeyword && activeKeyword !== "all") {
            // Get color based on trend keyword
            const markerColor = getCategoryColor(index);

            // Create pin SVG with rating number with one decimal place
            const pinSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
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

            // Set custom icon
            marker.setIcon({
                url: svgUrl,
                scaledSize: new google.maps.Size(30, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 45),
                labelOrigin: new google.maps.Point(15, labelOriginY),
            });

            // Get the summarized restaurant name
            let displayName = restaurant.name;
            if (restaurant.name.length > 8) {
                displayName = restaurant.name.substring(0, 7) + "…";
            }

            // Add label with restaurant name and more transparent background
            marker.setLabel({
                text: displayName,
                color: "#333333",
                fontSize: "10px",
                fontWeight: "bold",
                className: `marker-label marker-label-${
                    index % 2
                } marker-label-transparent`,
            });

            // Set z-index to bring selected markers to front
            if (activeInfoWindow === restaurant.id) {
                marker.setZIndex(1000);
            } else {
                marker.setZIndex(100);
            }
        } else {
            // For "all" categories, use category-colored markers
            const markerColor = getCategoryColor(index);

            // Create category pin SVG with rating number with one decimal place
            const categoryPinSVG = `
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
            const categoryPinUrl =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(categoryPinSVG);

            // Set custom icon
            marker.setIcon({
                url: categoryPinUrl,
                scaledSize: new google.maps.Size(30, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 45),
                labelOrigin: new google.maps.Point(15, labelOriginY),
            });

            if (activeKeyword && !showCategoryLabels) {
                marker.setLabel({
                    text: restaurant.trendkeyword,
                    color: "#333333",
                    fontSize: "10px",
                    fontWeight: "bold",
                    className: `marker-label marker-label-${
                        index % 2
                    } marker-label-transparent`,
                });
            } else if (showCategoryLabels) {
                marker.setLabel({
                    text: restaurant.trendkeyword,
                    color: "#333333",
                    fontSize: "10px",
                    fontWeight: "bold",
                    className: `marker-label marker-label-${
                        index % 2
                    } marker-label-transparent`,
                });
            } else {
                marker.setLabel(null);
            }
        }
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            {!map && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-700">地図を読み込み中...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
