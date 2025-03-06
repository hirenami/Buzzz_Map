import React, { useState, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import {
    Bookmark,
    LogIn,
    Settings,
    Heart,
    History,
    Star,
    ChevronRight,
    User,
} from "lucide-react";
import { TrendingKeyword, Restaurant } from "../types";

interface UserTabProps {
    keywords: TrendingKeyword[];
    onKeywordClick: (keyword: string) => void;
}

const UserTab: React.FC<UserTabProps> = ({ onKeywordClick }) => {
    const { isSignedIn, user } = useUser();
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<Restaurant[]>([]);
    const [activeSection, setActiveSection] = useState<
        "main" | "bookmarks" | "history"
    >("main");

    // ブックマークを読み込む（ローカルストレージから）
    useEffect(() => {
        if (isSignedIn && user) {
            const savedBookmarks = localStorage.getItem(`bookmarks-${user.id}`);
            if (savedBookmarks) {
                setBookmarks(JSON.parse(savedBookmarks));
            }

            const savedHistory = localStorage.getItem(`history-${user.id}`);
            if (savedHistory) {
                setRecentlyViewed(JSON.parse(savedHistory));
            }
        }
    }, [isSignedIn, user]);

    // ブックマークを保存する
    const saveBookmarks = (newBookmarks: string[]) => {
        if (isSignedIn && user) {
            localStorage.setItem(
                `bookmarks-${user.id}`,
                JSON.stringify(newBookmarks)
            );
            setBookmarks(newBookmarks);
        }
    };

    // ブックマークを追加/削除する
    const toggleBookmark = (keyword: string) => {
        if (bookmarks.includes(keyword)) {
            saveBookmarks(bookmarks.filter((k) => k !== keyword));
        } else {
            saveBookmarks([...bookmarks, keyword]);
        }
    };

    // ブックマークセクションを表示
    const renderBookmarksSection = () => {
        return (
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setActiveSection("main")}
                        className="flex items-center text-blue-600"
                    >
                        <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
                        <span>戻る</span>
                    </button>
                    <h2 className="text-lg font-bold">ブックマーク</h2>
                    <div className="w-16"></div> {/* スペーサー */}
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-8">
                        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                            ブックマークがありません
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            トレンドタブでキーワードをブックマークしてみましょう
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {bookmarks.map((keyword) => {
                            return (
                                <div
                                    key={keyword}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                    onClick={() => {
                                        onKeywordClick(keyword);
                                        setActiveSection("main");
                                    }}
                                >
                                    <div>
                                        <h3 className="font-medium">
                                            {keyword}
                                        </h3>
                                    </div>
                                    <button
                                        className="p-2 text-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(keyword);
                                        }}
                                    >
                                        <Bookmark className="h-5 w-5 fill-current" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // 履歴セクションを表示
    const renderHistorySection = () => {
        return (
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setActiveSection("main")}
                        className="flex items-center text-blue-600"
                    >
                        <ChevronRight className="h-4 w-4 transform rotate-180 mr-1" />
                        <span>戻る</span>
                    </button>
                    <h2 className="text-lg font-bold">閲覧履歴</h2>
                    <div className="w-16"></div> {/* スペーサー */}
                </div>

                {recentlyViewed.length === 0 ? (
                    <div className="text-center py-8">
                        <History className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">閲覧履歴がありません</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentlyViewed.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="flex items-start p-3 bg-white rounded-lg border border-gray-200"
                            >
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                                    <img
                                        src={restaurant.photo_url}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm">
                                        {restaurant.name}
                                    </h3>
                                    <div className="flex items-center mt-1">
                                        <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs ml-1">
                                                {restaurant.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="mx-2 text-gray-300">
                                            |
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {restaurant.trendkeyword}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // メインセクションを表示
    const renderMainSection = () => {
        if (!isSignedIn) {
            return (
                <div className="flex flex-col items-center justify-center h-full py-12">
                    <User className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold mb-2">
                        ログインしてください
                    </h2>
                    <p className="text-gray-500 text-center mb-6 px-8">
                        ログインするとトレンドをブックマークしたり、閲覧履歴を確認できます。
                    </p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium flex items-center">
                            <LogIn className="h-4 w-4 mr-2" />
                            ログイン / 新規登録
                        </button>
                    </SignInButton>
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center p-4 border-b">
                    <div className="mr-3">
                        <UserButton />
                    </div>
                    <div>
                        <h2 className="font-bold">
                            {user?.fullName || "ユーザー"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg"
                            onClick={() => setActiveSection("bookmarks")}
                        >
                            <Bookmark className="h-6 w-6 text-blue-600 mb-2" />
                            <span className="text-sm font-medium">
                                ブックマーク
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                {bookmarks.length}件
                            </span>
                        </button>

                        <button
                            className="flex flex-col items-center justify-center bg-purple-50 p-4 rounded-lg"
                            onClick={() => setActiveSection("history")}
                        >
                            <History className="h-6 w-6 text-purple-600 mb-2" />
                            <span className="text-sm font-medium">
                                閲覧履歴
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                {recentlyViewed.length}件
                            </span>
                        </button>
                    </div>

                    <div className="space-y-2">
                        <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <Heart className="h-5 w-5 text-gray-500 mr-3" />
                                <span>お気に入り店舗</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>

                        <button className="flex items-center justify-between w-full p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center">
                                <Settings className="h-5 w-5 text-gray-500 mr-3" />
                                <span>設定</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // アクティブなセクションに基づいて表示を切り替え
    const renderContent = () => {
        switch (activeSection) {
            case "bookmarks":
                return renderBookmarksSection();
            case "history":
                return renderHistorySection();
            default:
                return renderMainSection();
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 pb-16">
            {renderContent()}
        </div>
    );
};

export default UserTab;
