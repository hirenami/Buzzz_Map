import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { mapService } from "./services/mapService";
import { Restaurant, TrendingKeyword } from "./types";
import Map from "./components/Map";
import ExploreTabHeader from "./components/ExploreTabHeader";
import ListTabHeader from "./components/ListTabHeader";
import TrendingList from "./components/TrendingList";
import TabBar from "./components/TabBar";
import { Info } from "lucide-react";
import getTrend from "./services/getTrend";
import UserTab from "./components/UserTab";

function App() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const { error, position } = useGeolocation();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<
        Restaurant[]
    >([]);
    const [trending, setTrending] = useState<TrendingKeyword[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] =
        useState<Restaurant | null>(null);
    const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"explore" | "trending" | "user">(
        "explore"
    );
    const [mapHeight, setMapHeight] = useState<number>(70); // Default map height percentage (0-100)
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, setShowRestaurants] = useState<boolean>(false);
    const [tabChangeAnimation, setTabChangeAnimation] =
        useState<boolean>(false);
    const [autoSwitchEnabled, setAutoSwitchEnabled] = useState<boolean>(false);
    const [currentKeywordIndex, setCurrentKeywordIndex] = useState<number>(0);
    const [activeMode, setActiveMode] = useState<"trend" | "event">("trend"); // 追加
    const [activeEventCategory, setActiveEventCategory] =
        useState<string>("all");
    const autoSwitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialDataLoadedRef = useRef<boolean>(false);

    // Default location (Shibuya, Tokyo)
    const defaultLocation = { lat: 35.658, lng: 139.7016 };

    // Current map center
    const mapCenter = position || defaultLocation;

    // Fetch initial restaurants for all keywords when position changes
    useEffect(() => {
        const fetchInitialRestaurants = async () => {
            if (position && !initialDataLoadedRef.current) {
                setIsLoading(true);
                initialDataLoadedRef.current = true;

                try {
                    // Get all keywords
                    const data = await getTrend();
                    setTrending(data);
                    const locations = data.map(
                        (trend: TrendingKeyword) => trend.location
                    );

                    // Fetch restaurants for each keyword (fetch more per keyword for initial load)
                    const allRestaurantsPromises = locations.map(
                        (location: string) =>
                            mapService(location, position.lat, position.lng, 5)
                    );

                    const results = await Promise.all(allRestaurantsPromises);

                    // Flatten the array of arrays
                    const allRestaurants = results
                        .flat()
                        .filter((item) => item !== null);

                    setRestaurants(allRestaurants);

                    // When "all" is selected, show one restaurant from each category
                    const representativeRestaurants: Restaurant[] = [];
                    const includedKeywords = new Set<string>();

                    // Get one restaurant from each category
                    allRestaurants.forEach((restaurant) => {
                        representativeRestaurants.push(restaurant);
                        includedKeywords.add(restaurant.trendkeyword);

                        console.log("Restaurant:", restaurant);
                    });

                    console.log(
                        "Representative Restaurants:",
                        representativeRestaurants
                    );

                    setFilteredRestaurants(representativeRestaurants);
                } catch (error) {
                    console.error("初期レストラン取得エラー:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchInitialRestaurants();
    }, [position]);

    // Filter restaurants based on active keyword
    useEffect(() => {
        if (activeKeyword === null || activeKeyword === "all") {
            // When "all" is selected, show one restaurant from each category
            const representativeRestaurants: Restaurant[] = [];
            const includedKeywords = new Set<string>();

            // Get one restaurant from each category
            restaurants.forEach((restaurant) => {
                if (restaurant == null || restaurant.trendkeyword == null)
                    return;

                representativeRestaurants.push(restaurant);
                includedKeywords.add(restaurant.trendkeyword);
            });

            setFilteredRestaurants(representativeRestaurants);
        } else {
            setFilteredRestaurants(
                restaurants.filter((r) => r.trendkeyword === activeKeyword)
            );
        }
    }, [activeKeyword, restaurants]);

    // Handle keyword selection
    const handleKeywordClick = useCallback(
        async (keyword: string) => {
            // If "all" is selected, reset to show all restaurants
            if (keyword === "all") {
                setActiveKeyword(null);
                setSelectedRestaurant(null);
                setActiveMode("trend"); // 必要に応じてモードをリセット
                return;
            }

            setActiveKeyword(keyword);
            setSelectedRestaurant(null);
            setShowRestaurants(true);

            // Check if we already have enough restaurants for this keyword
            const existingRestaurants = restaurants.filter(
                (r) => r.trendkeyword === keyword
            );
            if (existingRestaurants.length >= 5) {
                // We already have enough restaurants for this keyword
                return;
            }

            // Show loading state
            setIsLoading(true);

            try {
                // Fetch real restaurants from Google Maps API
                const realRestaurants = await mapService(
                    keyword,
                    mapCenter.lat,
                    mapCenter.lng,
                    5 // Fetch more restaurants for the selected keyword
                );

                if (realRestaurants.length > 0) {
                    // Update restaurants for this keyword
                    const updatedRestaurants = [...restaurants];

                    // Remove existing restaurants with this keyword
                    const filteredRestaurants = updatedRestaurants.filter(
                        (r) => r.trendkeyword !== keyword
                    );

                    // Add the new restaurants
                    const newRestaurants = [
                        ...filteredRestaurants,
                        ...realRestaurants,
                    ];

                    setRestaurants(newRestaurants);
                }
            } catch (error) {
                console.error("レストラン取得エラー:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [mapCenter.lat, mapCenter.lng, restaurants]
    );

    // Handle restaurant selection
    const handleRestaurantClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        console.log("Selected Restaurant:", restaurant);
        console.log("activeTab:", activeTab);

        // If we're in the trending tab, switch to the explore tab to show the restaurant on the map
        if (activeTab === "trending") {
            setActiveTab("explore");
        }
    };

    // Handle tab change
    const handleTabChange = (tab: "explore" | "trending" | "user") => {
        if (activeTab !== tab) {
            // Trigger animation when tab changes
            setTabChangeAnimation(true);

            // Set a timeout to reset the animation state
            setTimeout(() => {
                setTabChangeAnimation(false);
            }, 100);

            setActiveTab(tab);

            // Reset showRestaurants when switching to explore tab
            if (tab === "explore") {
                setShowRestaurants(false);
            }
        }
    };

    // Handle mini map click from trending tab
    const handleMiniMapClick = (keyword: string) => {
        // Set the active keyword
        setActiveKeyword(keyword);

        // Switch to explore tab
        setActiveTab("explore");

        // Reset selected restaurant
        setSelectedRestaurant(null);
    };

    // Add event listeners for drag
    useEffect(() => {
        // Handle drag move
        const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
            if (!isDragging) return;

            let currentY: number;
            if ("touches" in e) {
                currentY = e.touches[0].clientY;
            } else {
                currentY = e.clientY;
            }

            const deltaY = startY - currentY;
            const deltaPercent = (deltaY / window.innerHeight) * 100;

            // Update map height with constraints (20% to 90%)
            const newHeight = Math.min(
                Math.max(mapHeight + deltaPercent, 20),
                90
            );
            setMapHeight(newHeight);
            setStartY(currentY);
        };

        // Handle drag end
        const handleDragEnd = () => {
            setIsDragging(false);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                e.preventDefault();
                handleDragMove(e as unknown as React.MouseEvent);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                handleDragEnd();
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                handleDragMove(e as unknown as React.TouchEvent);
            }
        };

        const handleTouchEnd = () => {
            if (isDragging) {
                handleDragEnd();
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, mapHeight, startY]);

    // Toggle auto-switching of categories
    const toggleAutoSwitch = () => {
        setAutoSwitchEnabled((prev) => !prev);
    };

    // Auto-switch categories effect
    useEffect(() => {
        // Clear any existing interval when the effect runs
        if (autoSwitchIntervalRef.current) {
            clearInterval(autoSwitchIntervalRef.current);
            autoSwitchIntervalRef.current = null;
        }

        // If auto-switch is enabled, set up the interval
        if (autoSwitchEnabled) {
            autoSwitchIntervalRef.current = setInterval(() => {
                // Get the next keyword index
                const nextIndex = (currentKeywordIndex + 1) % trending.length;
                setCurrentKeywordIndex(nextIndex);

                // Get the next keyword and trigger the click
                const nextKeyword = trending[nextIndex].keyword;
                handleKeywordClick(nextKeyword);
            }, 6000); // Switch every 6 seconds
        }

        // Clean up the interval when the component unmounts or when autoSwitchEnabled changes
        return () => {
            if (autoSwitchIntervalRef.current) {
                clearInterval(autoSwitchIntervalRef.current);
            }
        };
    }, [autoSwitchEnabled, currentKeywordIndex, handleKeywordClick, trending]);

    // Explore tab content
    const exploreTabContent = (
        <div className="flex flex-col h-full relative">
            {/* Map as the base layer */}
            <div className="absolute inset-0 z-0">
                <Map
                    restaurants={filteredRestaurants}
                    center={
                        selectedRestaurant
                            ? {
                                  lat: selectedRestaurant.lat,
                                  lng: selectedRestaurant.lng,
                              }
                            : mapCenter
                    }
                    onMarkerClick={handleRestaurantClick}
                    activeKeyword={activeKeyword}
                    showCategoryLabels={activeKeyword === null}
                />
            </div>

            {/* Floating top section - Trending Keywords */}
            <div
                className={`relative z-10 w-full transition-opacity duration-100 ${
                    tabChangeAnimation
                        ? "opacity-0 transform -translate-y-4"
                        : "opacity-100 transform translate-y-0"
                }`}
            >
                <div className="p-2 pt-3">
                    <ExploreTabHeader
                        activeMode={activeMode}
                        onModeChange={(mode) => setActiveMode(mode)}
                        activeKeyword={activeKeyword}
                        keywords={trending}
                        onKeywordClick={handleKeywordClick}
                        isLoading={isLoading}
                        autoSwitchEnabled={autoSwitchEnabled}
                        onToggleAutoSwitch={toggleAutoSwitch}
                        activeEventCategory={activeEventCategory}
                        onEventCategoryChange={setActiveEventCategory}
                    />
                </div>
            </div>

            {/* Flexible middle space - for map interaction */}
            <div className="flex-1"></div>

            {/* Floating bottom section - Content and Tab Bar */}
            <div className="relative z-10 w-full">
                {/* Content area */}
                <div className="bg-white">
                    {error && !position && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded mx-2">
                            <div className="flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                <p>{error}</p>
                            </div>
                            <p className="mt-2">
                                代わりにデフォルトの位置を使用します。
                            </p>
                        </div>
                    )}

                    {/* Empty container for explore tab to maximize map visibility */}
                    <div className="h-0"></div>
                </div>
            </div>
        </div>
    );

    // Trending tab content
    const trendingTabContent = (
        <div className="flex flex-col h-full relative bg-white">
            {/* ListTabHeader inserted */}
            <div className="p-2 pt-3">
                <ListTabHeader
                    activeMode={activeMode} // 修正
                    onModeChange={setActiveMode} // 修正
                    activeKeyword={activeKeyword}
                />
            </div>
            {/* Full screen content area */}
            <div
                className={`flex-1 overflow-hidden transition-opacity duration-100 ${
                    tabChangeAnimation
                        ? "opacity-0 transform translate-y-4"
                        : "opacity-100 transform translate-y-0"
                }`}
            >
                <TrendingList
                    keywords={trending}
                    activeKeyword={activeKeyword}
                    onKeywordClick={handleKeywordClick}
                    onMapClick={handleMiniMapClick}
                    activeMode={activeMode} // 修正
                />
            </div>
        </div>
    );

    const userTabContent = (
        <div className="flex flex-col h-full relative bg-white">
            {/* Full screen content area */}
            <div
                className={`flex-1 overflow-hidden transition-opacity duration-100 ${
                    tabChangeAnimation
                        ? "opacity-0 transform translate-y-4"
                        : "opacity-100 transform translate-y-0"
                }`}
            >
                <UserTab
                    keywords={trending}
                    onKeywordClick={handleKeywordClick}
                    restaurants={restaurants}
                />
            </div>
        </div>
    );

    // App content with tab-specific content
    const appContent = (
        <div className="flex flex-col h-screen overflow-hidden relative">
            {/* コンテンツ表示部分 */}
            <div className="flex-1">
                {activeTab === "explore"
                    ? exploreTabContent
                    : activeTab === "trending"
                    ? trendingTabContent
                    : userTabContent}
            </div>

            {/* タブバー固定 */}
            <div
                className="fixed bottom-0 w-full z-50"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
        </div>
    );

    return <div>{appContent}</div>;
}

export default App;
