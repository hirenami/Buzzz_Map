"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUser, SignInButton,UserButton } from "@clerk/clerk-react";
import { LogIn, Star, Sparkles, MapPin } from "lucide-react";
import type { TrendingKeyword, Restaurant } from "../types";

interface UserTabProps {
    keywords: TrendingKeyword[];
    onKeywordClick: (keyword: string) => void;
    restaurants: Restaurant[]; // レストラン情報を受け取るためのprops
}

// サーバーからおすすめのレストランインデックスを取得する関数
async function fetchRecommendedRestaurants(
    userId: string,
    count = 5
): Promise<number[]> {
	const url = import.meta.env.VITE_LOCALHOST;
    try {
        const response = await fetch(
            `${url}/predict?userID=${userId}&number=${count}`
        );
        if (!response.ok) {
            throw new Error("おすすめレストランの取得に失敗しました");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("おすすめレストラン取得エラー:", error);
        return [];
    }
}

const UserTab: React.FC<UserTabProps> = ({
    onKeywordClick,
    restaurants,
}) => {
    const { isSignedIn, user } = useUser();
    const [recommendedRestaurants, setRecommendedRestaurants] = useState<
        Restaurant[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // おすすめレストランを読み込む
    useEffect(() => {
        if (isSignedIn && user && restaurants.length > 0) {
            fetchRecommendedRestaurantsData();
        }
    }, [isSignedIn, user, restaurants]); //eslint-disable-line

    // おすすめレストランを取得する関数
    const fetchRecommendedRestaurantsData = async () => {
        if (!isSignedIn || !user || restaurants.length === 0) return;

        setIsLoading(true);
        try {
            // サーバーからおすすめのインデックスを取得
            const recommendedIndices = await fetchRecommendedRestaurants(
                user.id,
				restaurants.length
            );
			console.log(recommendedIndices);
            // インデックスに対応するレストランを取得
            const recommended = (recommendedIndices || [])
                .map((index) => restaurants[index])
                .filter((restaurant) => restaurant !== undefined);

            setRecommendedRestaurants(recommended);
        } catch (error) {
            console.error("おすすめレストラン取得エラー:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ログインしていない場合のコンテンツ
    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 bg-gray-50">
                <Sparkles className="h-20 w-20 text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4 text-center">
                    あなたにぴったりのレストランを見つけましょう
                </h2>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                    ログインすると、あなた好みのレストランをおすすめします。好みや過去の閲覧履歴に基づいたパーソナライズされたおすすめをお楽しみください。
                </p>
                <SignInButton mode="modal">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium flex items-center text-lg shadow-md hover:bg-blue-700 transition-colors">
                        <LogIn className="h-5 w-5 mr-2" />
                        ログインして始める
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
		<div className="flex flex-col h-full">
		  {/* 固定ヘッダー */}
		  <div className="flex items-center p-4 border-b bg-white">
			<div className="mr-3">
			  <UserButton />
			</div>
			<div>
			  <h2 className="font-bold">{user?.fullName || "ユーザー"}</h2>
			  <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
			</div>
		  </div>
	
		  {/* スクロール可能なコンテンツエリア */}
		  <div className="flex-1 overflow-y-auto bg-gray-50">
			<div className="p-4 pb-20">
			  <div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold flex items-center">
				  <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
				  あなたへのおすすめ
				</h1>
				{isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>}
			  </div>
	
			  {isLoading && recommendedRestaurants.length === 0 ? (
				<div className="flex justify-center items-center py-20">
				  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
				</div>
			  ) : recommendedRestaurants.length === 0 ? (
				<div className="text-center py-16 px-4">
				  <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
				  <p className="text-gray-600 text-lg mb-2">おすすめレストランを準備中です</p>
				  <p className="text-gray-500">もう少しお待ちください。あなたにぴったりのレストランをご紹介します。</p>
				</div>
			  ) : (
				<div className="space-y-6">
				  {recommendedRestaurants.map((restaurant) => (
					<div key={restaurant.id} className="bg-white rounded-xl shadow-md overflow-hidden">
					  <div className="h-48 w-full relative">
						<img
						  src={restaurant.photo_url || "/placeholder.svg?height=400&width=600"}
						  alt={restaurant.name}
						  className="w-full h-full object-cover"
						/>
						<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
						<div className="absolute bottom-0 left-0 p-4 text-white">
						  <div className="flex items-center mb-1">
							<Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
							<span className="font-medium">{restaurant.rating.toFixed(1)}</span>
						  </div>
						  <h3 className="text-xl font-bold">{restaurant.name}</h3>
						</div>
					  </div>
					  <div className="p-4">
						<div className="flex items-center text-gray-600 mb-3">
						  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
						  <span className="text-sm truncate">
							{restaurant.address || restaurant.address || "住所情報なし"}
						  </span>
						</div>
						<div className="flex items-center justify-between">
						  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
							{restaurant.trendkeyword}
						  </div>
						  <button
							className="flex items-center text-blue-600 font-medium"
							onClick={() => onKeywordClick(restaurant.trendkeyword)}
						  >
						  </button>
						</div>
					  </div>
					</div>
				  ))}
				</div>
			  )}
			</div>
		  </div>
		</div>
	  );
};

export default UserTab;
