import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Home, Search, Plus, MessageCircle, User } from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Compose() {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      await backend.posts.create({
        content: content.trim(),
        location: location.trim() || undefined,
        universityId: user.universityId,
        userId: user.id,
      });

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      navigate("/feed");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="min-h-screen">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              create a post
            </h1>
          </div>

          {/* Post Form */}
          <div className="border-2 border-gray-400 rounded-lg p-6" style={{
            transform: 'rotate(0.5deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  placeholder="what's happening on campus?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="doodle w-full p-3 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800 resize-none"
                  style={{ transform: 'rotate(-0.3deg)' }}
                />
                <div className="text-right text-sm text-gray-500 mt-1" style={{ transform: 'rotate(0.2deg)' }}>
                  {content.length}/500
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" style={{ transform: 'rotate(1deg)' }} />
                <input
                  type="text"
                  placeholder="add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="doodle flex-1 p-2 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                  style={{ transform: 'rotate(-0.5deg)' }}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500" style={{ transform: 'rotate(0.3deg)' }}>
                  use #hashtags to categorize your post
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !content.trim()}
                  className="px-6 py-2 border-2 border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  style={{ 
                    transform: 'rotate(-0.5deg)',
                    background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)'
                  }}
                >
                  {loading ? "posting..." : "post"}
                </button>
              </div>
            </form>
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
            <button onClick={() => navigate('/compose')} className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-400 absolute -top-4 left-1/2 hover:bg-gray-300 transition-colors" style={{ 
              transform: 'translateX(-50%) rotate(2deg)',
              background: 'repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 2px, #d1d5db 2px, #d1d5db 4px)'
            }}>
              <Plus className="h-8 w-8 text-gray-600" style={{ transform: 'rotate(-1deg)' }} />
            </button>
            <button onClick={() => navigate('/events')} className="ml-20 hover:opacity-70 transition-opacity">
              <MessageCircle className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />
            </button>
            <button onClick={() => navigate(`/u/${user?.username}`)} className="hover:opacity-70 transition-opacity">
              <User className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
