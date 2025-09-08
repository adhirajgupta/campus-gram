import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Font, Header, Small } from "./Font";
import { useFonts } from "../hooks/useFonts";

export default function TopNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fonts = useFonts();

  if (!user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300" style={{
      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)',
      transform: 'rotate(-0.2deg)'
    }}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center bg-white relative"
               style={{ 
                 transform: 'rotate(2deg)',
                 background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
               }}>
            <div className="w-5 h-5 border border-gray-500 rounded-full flex items-center justify-center">
              <div className="text-gray-600 text-xs font-bold" style={{ transform: 'rotate(-2deg)' }}>CG</div>
            </div>
            {/* X marks with hand-drawn effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-gray-500 transform rotate-45" style={{ 
                background: 'linear-gradient(90deg, #6b7280 0%, transparent 20%, transparent 80%, #6b7280 100%)'
              }}></div>
              <div className="w-4 h-0.5 bg-gray-500 transform -rotate-45 absolute" style={{ 
                background: 'linear-gradient(90deg, #6b7280 0%, transparent 20%, transparent 80%, #6b7280 100%)'
              }}></div>
            </div>
          </div>
          <div>
            <Header className="text-lg font-bold text-gray-800" style={{ 
              transform: 'rotate(-1deg)',
              textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
            }}>
              Campus Gram
            </Header>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
            <input
              type="text"
              placeholder="search posts, events, people..."
              className="w-full h-8 pl-9 pr-3 text-sm border border-gray-400 rounded-lg bg-white focus:outline-none focus:border-gray-600"
              style={{
                transform: 'rotate(0.3deg)',
                ...fonts.primary,
                background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
              }}
              onClick={() => navigate('/search')}
            />
          </div>
        </div>

        {/* University Name (if available) */}
        <div className="text-right">
          <Small className="text-xs text-gray-600" style={{ 
            transform: 'rotate(0.5deg)'
          }}>
            {user.university?.name || 'University'}
          </Small>
        </div>
      </div>
    </div>
  );
}
