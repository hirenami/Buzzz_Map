import React, { useState } from 'react';
import { UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { Bookmark, LogIn } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

interface UserMenuProps {
  onShowBookmarks: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onShowBookmarks }) => {
  const { isSignedIn, user } = useUser();
  const { bookmarks } = useBookmarks();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        {isSignedIn ? (
          <>
            <button
              onClick={onShowBookmarks}
              className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="ブックマーク"
            >
              <Bookmark className="h-5 w-5 text-blue-600" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <div onClick={toggleMenu}>
              <UserButton />
            </div>
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="flex items-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors">
              <LogIn className="h-3 w-3 mr-1" />
              <span>ログイン</span>
            </button>
          </SignInButton>
        )}
      </div>

      {isMenuOpen && isSignedIn && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
            <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <button
            onClick={() => {
              onShowBookmarks();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            ブックマーク ({bookmarks.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;