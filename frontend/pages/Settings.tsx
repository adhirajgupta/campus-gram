import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { User, Mail, GraduationCap, BookOpen, Home, Search, Plus, MessageCircle, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fonts = useFonts();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    year: user?.year?.toString() || "",
    major: user?.major || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd call an update profile endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              settings
            </h1>
          </div>

          {/* Profile Information Card */}
          <div className="border-2 border-gray-400 rounded-lg p-6 mb-6" style={{
            transform: 'rotate(0.5deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <div className="mb-6">
              <h2 className="text-lg font-bold" style={{ transform: 'rotate(-0.3deg)' }}>profile information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(1deg)' }} />
                <input
                  name="fullName"
                  placeholder="full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="doodle flex-1 p-2 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                  style={{ transform: 'rotate(-0.2deg)' }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(-1deg)' }} />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="doodle flex-1 p-2 border-2 border-gray-400 rounded-lg bg-gray-100"
                  style={{ transform: 'rotate(0.3deg)' }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(0.5deg)' }} />
                <input
                  name="year"
                  type="number"
                  placeholder="year (1-4)"
                  value={formData.year}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="doodle flex-1 p-2 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                  style={{ transform: 'rotate(-0.4deg)' }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" style={{ transform: 'rotate(-0.5deg)' }} />
                <input
                  name="major"
                  placeholder="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="doodle flex-1 p-2 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                  style={{ transform: 'rotate(0.2deg)' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2 px-4 border-2 border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                style={{ 
                  transform: 'rotate(-0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)'
                }}
              >
                {loading ? "updating..." : "update profile"}
              </button>
            </form>
          </div>

          {/* Account Information Card */}
          <div className="border-2 border-gray-400 rounded-lg p-6" style={{
            transform: 'rotate(-0.3deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <div className="mb-6">
              <h2 className="text-lg font-bold" style={{ transform: 'rotate(0.2deg)' }}>account information</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ transform: 'rotate(-0.1deg)' }}>username:</span>
                <span className="font-medium" style={{ transform: 'rotate(0.1deg)' }}>@{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ transform: 'rotate(0.2deg)' }}>university id:</span>
                <span className="font-medium" style={{ transform: 'rotate(-0.2deg)' }}>{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ transform: 'rotate(-0.3deg)' }}>account type:</span>
                <span className="font-medium" style={{ transform: 'rotate(0.3deg)' }}>
                  {user.isAdmin ? "administrator" : "student"}
                </span>
              </div>
            </div>
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
              <User className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
