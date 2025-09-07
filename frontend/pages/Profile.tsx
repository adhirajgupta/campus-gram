import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, GraduationCap, BookOpen, Home, Search, Plus, MessageCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // In a real app, you'd fetch the profile based on username
  // For now, showing current user's profile
  const isOwnProfile = user?.username === username;
  const profileUser = user;

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <p className="text-gray-500" style={{ transform: 'rotate(-0.5deg)' }}>user not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="min-h-screen">
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
            <button onClick={() => navigate('/search')} className="hover:opacity-70 transition-opacity">
              <Search className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-2deg)' }} />
            </button>
            <button onClick={() => navigate('/compose')} className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-400 absolute -top-4 left-1/2 hover:bg-gray-200 transition-colors" style={{ 
              transform: 'translateX(-50%) rotate(2deg)',
              background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 2px, #f3f4f6 2px, #f3f4f6 4px)'
            }}>
              <Plus className="h-8 w-8 text-gray-500" style={{ transform: 'rotate(-1deg)' }} />
            </button>
            <button onClick={() => navigate('/events')} className="ml-20 hover:opacity-70 transition-opacity">
              <MessageCircle className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />
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
