import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { User, Mail, GraduationCap, BookOpen, Home, Search, Plus, MessageCircle, Settings, Shield, Bell, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fonts = useFonts();

  // In a real app, you'd fetch the profile based on username
  // For now, showing current user's profile
  const isOwnProfile = user?.username === username;
  const profileUser = user;

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={fonts.primary}>
        <Small className="text-gray-500" style={{ transform: 'rotate(-0.5deg)' }}>user not found</Small>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              profile
            </h1>
          </div>

          {/* Profile Card */}
          <div className="border-2 border-gray-400 rounded-lg p-6" style={{
            transform: 'rotate(0.5deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center" style={{ transform: 'rotate(-1deg)' }}>
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ transform: 'rotate(0.3deg)' }}>{profileUser.fullName}</h1>
                <p className="text-gray-600" style={{ transform: 'rotate(-0.2deg)' }}>@{profileUser.username}</p>
                {profileUser.isAdmin && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1" style={{ transform: 'rotate(0.5deg)' }}>
                    Administrator
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(1deg)' }} />
                <span className="text-gray-600" style={{ transform: 'rotate(-0.3deg)' }}>{profileUser.email}</span>
              </div>

              {profileUser.year && (
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(-1deg)' }} />
                  <span className="text-gray-600" style={{ transform: 'rotate(0.2deg)' }}>Year {profileUser.year}</span>
                </div>
              )}

              {profileUser.major && (
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(0.5deg)' }} />
                  <span className="text-gray-600" style={{ transform: 'rotate(-0.4deg)' }}>{profileUser.major}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="space-y-4 mt-6">
              <button
                onClick={() => navigate('/settings')}
                className="w-full py-3 px-4 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                style={{ 
                  transform: 'rotate(-0.3deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              
              {profileUser.isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full py-3 px-4 border-2 border-blue-400 rounded-lg font-bold text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                  style={{ 
                    transform: 'rotate(0.2deg)',
                    background: 'repeating-linear-gradient(45deg, #eff6ff, #eff6ff 2px, #dbeafe 2px, #dbeafe 4px)'
                  }}
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full py-3 px-4 border-2 border-red-400 rounded-lg font-bold text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                style={{ 
                  transform: 'rotate(-0.1deg)',
                  background: 'repeating-linear-gradient(45deg, #fef2f2, #fef2f2 2px, #fee2e2 2px, #fee2e2 4px)'
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <div className="text-center py-8">
            <p className="text-gray-500" style={{ transform: 'rotate(0.3deg)' }}>posts and activity would be displayed here</p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300" style={{
          background: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 2px, #e5e7eb 2px, #e5e7eb 4px)',
          transform: 'rotate(-0.5deg)'
        }}>
          <div className="flex justify-between items-center py-6 px-8 relative">
            <button onClick={() => navigate('/feed')} className="hover:opacity-70 transition-opacity">
              <Home className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(3deg)' }} />
            </button>
            <button onClick={() => navigate('/study-groups')} className="hover:opacity-70 transition-opacity">
              <MessageCircle className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-2deg)' }} />
            </button>
            <button onClick={() => navigate('/compose')} className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-400 absolute -top-4 left-1/2 hover:bg-gray-200 transition-colors" style={{ 
              transform: 'translateX(-50%) rotate(2deg)',
              background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 2px, #f3f4f6 2px, #f3f4f6 4px)'
            }}>
              <Plus className="h-8 w-8 text-gray-500" style={{ transform: 'rotate(-1deg)' }} />
            </button>
            <button onClick={() => navigate('/events')} className="ml-20 hover:opacity-70 transition-opacity">
              <Bell className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />
            </button>
            <button onClick={() => navigate(`/u/${user?.username}`)} className="hover:opacity-70 transition-opacity">
              <User className="h-7 w-7 text-gray-600" style={{ transform: 'rotate(2deg)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
