import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bookmark } from '../types';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (keyword: string) => void;
  removeBookmark: (keyword: string) => void;
  isBookmarked: (keyword: string) => boolean;
  loading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // ローカルストレージからブックマークを読み込む
  useEffect(() => {
    if (isSignedIn && user) {
      setLoading(true);
      const storedBookmarks = localStorage.getItem(`bookmarks-${user.id}`);
      if (storedBookmarks) {
        try {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          setBookmarks(parsedBookmarks);
        } catch (error) {
          console.error('ブックマークの読み込みエラー:', error);
          setBookmarks([]);
        }
      }
      setLoading(false);
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [isSignedIn, user]);

  // ブックマークの変更をローカルストレージに保存
  useEffect(() => {
    if (isSignedIn && user && !loading) {
      localStorage.setItem(`bookmarks-${user.id}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, user, isSignedIn, loading]);

  // ブックマークを追加
  const addBookmark = (keyword: string) => {
    if (!isSignedIn || !user) return;
    
    const newBookmark: Bookmark = {
      id: `${user.id}-${keyword}-${Date.now()}`,
      userId: user.id,
      keyword,
      createdAt: new Date()
    };
    
    setBookmarks(prev => [...prev, newBookmark]);
  };

  // ブックマークを削除
  const removeBookmark = (keyword: string) => {
    if (!isSignedIn || !user) return;
    
    setBookmarks(prev => prev.filter(bookmark => bookmark.keyword !== keyword));
  };

  // キーワードがブックマークされているかチェック
  const isBookmarked = (keyword: string) => {
    if (!isSignedIn || !user) return false;
    
    return bookmarks.some(bookmark => bookmark.keyword === keyword);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, loading }}>
      {children}
    </BookmarkContext.Provider>
  );
};