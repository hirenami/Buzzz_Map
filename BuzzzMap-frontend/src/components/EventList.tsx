"use client";

import type React from "react";
import { useEffect, useState } from "react";
import type { Event, Restaurant } from "../types";
import { Newspaper, Store } from "lucide-react";
import NewsArticleList from "./NewsArticleList";
import RestaurantList from "./RestaurantList";
import MiniMap from "./MiniMap";
import { mapService } from "../services/mapService";
import { useGeolocation } from "../hooks/useGeolocation";

interface EventListProps {
    events: Event[];
    selectedEvent: Event | null;
    onEventClick: (event: Event) => void;
    onBackClick?: () => void;
    category?: string;
}

const EventList: React.FC<EventListProps> = ({
    events,
    selectedEvent,
    onEventClick,
}) => {
    const { position } = useGeolocation();
    const [isVisible, setIsVisible] = useState(false);
    const [viewMode, setViewMode] = useState<
        "events" | "articles" | "restaurants"
    >("events");
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Add animation when component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Format increase percentage
    const formatIncreasePercentage = (increasePercentage: number): string => {
        return increasePercentage > 0
            ? `+${increasePercentage.toFixed(2)}%`
            : `${increasePercentage.toFixed(2)}%`;
    };

    const handleNewsClick = (event: Event) => {
        setSelectedKeyword(event.keyword);
        setViewMode("articles");
    };

    const defaultLocation = { lat: 35.658, lng: 139.7016 };

    // Current map center
    const mapCenter = position || defaultLocation;

    const handleStoreClick = async (event: Event) => {
        setSelectedKeyword(event.keyword);
        setIsLoading(true);

        try {
            const fetchedRestaurants = await mapService(
                event.keyword,
                mapCenter.lat,
                mapCenter.lng,
                10
            );

            setRestaurants(fetchedRestaurants);
            setViewMode("restaurants");
        } catch (error) {
            console.error("レストラン取得エラー:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEvents = () => {
        setViewMode("events");
        setSelectedKeyword(null);
    };

    const handleMiniMapClick = () => {
        // 必要に応じてマップ全画面表示などの処理を追加
    };

    const onBackClick = () => {
        setViewMode("events"); // 戻るボタンがクリックされたときの処理
    };

    if (viewMode === "articles" && selectedKeyword) {
        return (
            <div className="h-full overflow-hidden">
                <NewsArticleList
                    keyword={selectedKeyword}
                    onBackClick={handleBackToEvents}
                />
            </div>
        );
    }

    if (viewMode === "restaurants" && selectedKeyword) {
        return restaurants ? (
            <div className="h-full flex flex-col">
                <div className="h-1/3 p-2">
                    <MiniMap
                        restaurants={restaurants}
                        keyword={selectedKeyword}
                        onMapClick={handleMiniMapClick}
                    />
                </div>
                <div className="h-2/3 overflow-y-auto">
                    <RestaurantList
                        restaurants={restaurants}
                        selectedRestaurant={null}
                        onRestaurantClick={() => {}}
                        onBackClick={handleBackToEvents}
                    />
                </div>
            </div>
        ) : (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-sm mb-4">
                        データが見つかりませんでした
                    </p>
                    {/* 戻るボタン */}
                    <button
                        onClick={onBackClick} // 親コンポーネントから渡された戻る関数を呼び出す
                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                    >
                        戻る
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`p-2 pb-16 transition-opacity duration-100 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            {events.length === 0 ? (
                <p className="text-gray-500 text-center py-2 text-xs animate-fade-in">
                    イベントが見つかりませんでした
                </p>
            ) : (
                <div className="space-y-2">
                    {events.map((event, index) => (
                        <div
                            key={event.keyword}
                            className={`p-2 rounded-lg cursor-pointer transition-colors border animate-scale-in`}
                            style={{
                                animationDelay: `${index * 20}ms`,
                                animationFillMode: "both",
                                backgroundColor:
                                    selectedEvent?.keyword === event.keyword
                                        ? "rgba(239, 246, 255, 1)"
                                        : "white",
                                borderColor:
                                    selectedEvent?.keyword === event.keyword
                                        ? "rgba(191, 219, 254, 1)"
                                        : "rgba(243, 244, 246, 1)",
                            }}
                            onClick={() => onEventClick(event)}
                        >
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm text-gray-900">
                                        {event.keyword}
                                    </h3>

                                    {/* 月数と上昇率の表示部分 */}
                                    <div className="mt-1 text-xs text-gray-600">
                                        <p>過去 {event.months} ヶ月のデータ</p>
                                        <p className="text-xs text-green-600 text-[11px]">
                                            🔥トレンドの上昇率:{" "}
                                            {formatIncreasePercentage(
                                                event.increase_percentage
                                            )}
                                        </p>
                                    </div>

                                    {/* ロケーション情報 */}
                                    <div className="flex items-center mt-1 text-xs text-gray-600">
                                        <span className="truncate">
                                            {event.location}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center ml-2 space-x-2">
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNewsClick(event);
                                        }}
                                        aria-label={`${event.keyword}のニュース記事を見る`}
                                    >
                                        <Newspaper className="w-4 h-4 text-purple-500" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStoreClick(event);
                                        }}
                                        aria-label={`${event.keyword}の店舗を見る`}
                                    >
                                        <Store className="w-4 h-4 text-blue-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                        <p className="text-sm">データを読み込み中...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventList;
