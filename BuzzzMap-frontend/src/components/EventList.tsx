import React, { useEffect, useState } from "react";
import { Event } from "../types";

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
    const [isVisible, setIsVisible] = useState(false);

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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
