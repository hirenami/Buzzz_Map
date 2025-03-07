import React from "react";
import { TrendingKeyword } from "../types";

interface ExploreTabHeaderProps {
    activeMode: "trend" | "event";
    onModeChange: (mode: "trend" | "event") => void;
    activeKeyword: string | null;
    keywords: TrendingKeyword[];
    onKeywordClick: (keyword: string) => void;
    isLoading?: boolean;
    autoSwitchEnabled?: boolean;
    onToggleAutoSwitch?: () => void;
    activeEventCategory?: string;
    onEventCategoryChange?: (category: string) => void;
}

const ExploreTabHeader: React.FC<ExploreTabHeaderProps> = ({
    activeKeyword,
    keywords,
    onKeywordClick,
    isLoading = false,
    autoSwitchEnabled = false,
}) => {

    return (
        <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-2 animate-slide-down">
            {/* キーワードまたはイベントカテゴリの表示 */}
            <div className="flex overflow-x-auto pb-1 -mx-1 hide-scrollbar">
                <>
                    <button
                        className={`flex-shrink-0 px-2 py-0.5 mx-1 rounded-full text-xs transition-colors ${
                            activeKeyword === null
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => onKeywordClick("all")}
                        disabled={isLoading}
                        data-keyword="all"
                    >
                        すべて
                    </button>

                    {keywords.map((item) => (
                        <button
                            key={item.rank}
                            data-keyword={item.keyword}
                            className={`flex-shrink-0 px-2 py-0.5 mx-1 rounded-full text-xs transition-colors ${
                                activeKeyword === item.keyword
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 hover:bg-gray-200"
                            } ${
                                autoSwitchEnabled &&
                                activeKeyword === item.keyword
                                    ? "animate-pulse"
                                    : ""
                            }`}
                            onClick={() => onKeywordClick(item.keyword)}
                            disabled={isLoading}
                        >
                            {item.keyword}
                        </button>
                    ))}
                </>
            </div>
            {/* ローディングスピナー */}
            {isLoading && (
                <div className="flex justify-center mt-1">
                    <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default ExploreTabHeader;
