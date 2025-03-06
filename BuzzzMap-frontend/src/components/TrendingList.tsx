import React, { useEffect, useState } from "react";
import { TrendingKeyword, Event } from "../types";
import { TrendingUp, Newspaper, Store } from "lucide-react";
import NewsArticleList from "./NewsArticleList";
import RestaurantList from "./RestaurantList";
import EventList from "./EventList";  // Make sure EventList is defined and imported
import { mapService } from "../services/mapService";
import MiniMap from "./MiniMap";

interface TrendingListProps {
    keywords: TrendingKeyword[];
    activeKeyword: string | null;
    onKeywordClick: (keyword: string) => void;
    onMapClick?: (keyword: string) => void;
    activeMode: 'trend' | 'event';
}

const TrendingList: React.FC<TrendingListProps> = ({
    keywords,
    activeKeyword,
    onKeywordClick,
    onMapClick,
    activeMode,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [prevKeyword, setPrevKeyword] = useState<string | null>(activeKeyword);
    const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
    const [viewMode, setViewMode] = useState<"keywords" | "articles" | "restaurants">("keywords");
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // イベント関連の状態
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // イベントクリック時のハンドラー
    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        // 必要に応じて他の処理を追加
    };

    // バックボタンクリック時のハンドラー
    const handleBackClick = () => {
        setViewMode("keywords");
        setSelectedKeyword(null);
        setSelectedEvent(null);
    };

    // イベントデータの取得
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/events"); // 実際のAPIエンドポイントに置き換えてください
                const data: Event[] = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("イベント取得エラー:", error);
            }
        };

        fetchEvents();
    }, []);

    // Add animation when component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Handle animation when active keyword changes
    useEffect(() => {
        if (activeKeyword !== prevKeyword && prevKeyword !== null && activeKeyword !== null) {
            const currentIndex = keywords.findIndex((k) => k.keyword === activeKeyword);
            const prevIndex = keywords.findIndex((k) => k.keyword === prevKeyword);

            if (currentIndex > prevIndex || (prevIndex === keywords.length - 1 && currentIndex === 0)) {
                setSlideDirection("left");
            } else {
                setSlideDirection("right");
            }

            const timer = setTimeout(() => {
                setSlideDirection(null);
            }, 500);

            return () => clearTimeout(timer);
        }

        setPrevKeyword(activeKeyword);
    }, [activeKeyword, prevKeyword, keywords]);

    const handleNewsClick = (keyword: string) => {
        setSelectedKeyword(keyword);
        setViewMode("articles");
    };

    const handleStoreClick = async (keyword: string) => {
        setSelectedKeyword(keyword);
        setIsLoading(true);

        try {
            const defaultLocation = { lat: 35.658, lng: 139.7016 };

            const fetchedRestaurants = await mapService(
                keyword,
                defaultLocation.lat,
                defaultLocation.lng,
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

    const handleMiniMapClick = () => {
        if (selectedKeyword && onMapClick) {
            onMapClick(selectedKeyword);
        }
    };

    const formatTrendInfo = (timestamp?: number, percentage?: number): string => {
        if (!timestamp || !percentage) return "";

        const now = Math.floor(Date.now() / 1000);
        const diffSeconds = now - timestamp;

        let timeText = "";
        if (diffSeconds < 0) {
            timeText = "数分前";
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            timeText = `${minutes}分前`;
        } else if (diffSeconds < 86400) {
            const hours = Math.floor(diffSeconds / 3600);
            timeText = `${hours}時間前`;
        } else {
            const days = Math.floor(diffSeconds / 86400);
            timeText = `${days}日前`;
        }

        return `${timeText} に ${percentage}% ⤴︎`;
    };

    if (viewMode === "articles" && selectedKeyword) {
        return (
            <div className="h-full overflow-hidden">
                <NewsArticleList
                    keyword={selectedKeyword}
                    onBackClick={handleBackClick}
                />
            </div>
        );
    }

    if (viewMode === "restaurants" && selectedKeyword) {
        return (
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
                        onBackClick={handleBackClick}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full bg-white pt-2 pb-16 px-3 overflow-y-auto transition-opacity duration-100 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center justify-between mb-3 animate-slide-down">
                <h2 className="text-sm font-bold flex items-center">
                    <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
                    トレンドフード＆ドリンク
                </h2>
            </div>

            {activeMode === 'trend' ? (
                <div className="space-y-2">
                    {keywords.map((item, index) => (
                        <div
                            key={item.rank}
                            className={`py-2 px-3 rounded-lg transition-colors border animate-scale-in ${slideDirection === "left" && activeKeyword === item.keyword ? "animate-slide-in-left" : slideDirection === "right" && activeKeyword === item.keyword ? "animate-slide-in-right" : ""}`}
                            style={{
                                animationDelay: `${index * 20}ms`,
                                animationFillMode: "both",
                                backgroundColor: activeKeyword === item.keyword ? "rgba(239, 246, 255, 1)" : "white",
                                borderColor: activeKeyword === item.keyword ? "rgba(191, 219, 254, 1)" : "rgba(243, 244, 246, 1)",
                            }}
                        >
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-gray-500 font-medium text-xs">
                                    {item.rank}
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onKeywordClick(item.keyword)}>
                                    <h3 className="font-bold text-sm text-gray-900">{item.keyword}</h3>
                                    {item.end_timestamp && item.increase_percentage && (
                                        <div className="flex items-center mt-1 text-xs text-green-600 text-[11px]">
                                            <span className="mr-1">🔥</span>
                                            <span>{formatTrendInfo(item.end_timestamp, item.increase_percentage)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center ml-2 space-x-2">
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); handleNewsClick(item.keyword); }}
                                        aria-label={`${item.keyword}のニュース記事を見る`}
                                    >
                                        <Newspaper className="w-4 h-4 text-purple-500" />
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); handleStoreClick(item.keyword); }}
                                        aria-label={`${item.keyword}の店舗を見る`}
                                    >
                                        <Store className="w-4 h-4 text-blue-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EventList 
                    events={events} 
                    selectedEvent={selectedEvent} 
                    onEventClick={handleEventClick} 
                    onBackClick={handleBackClick} 
                />
            )}

            <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
                <p className="text-xs text-blue-700 flex items-start">
                    <TrendingUp className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>トレンドアイテムをタップして、人気の食べ物や飲み物を提供するレストランを見つけましょう。</span>
                </p>
            </div>

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

export default TrendingList;
