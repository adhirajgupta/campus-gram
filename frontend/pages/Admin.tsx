import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Users, FileText, Calendar, Trash2, Ban } from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock admin data - in real app, you'd have admin endpoints
  const adminStats = {
    totalUsers: 52,
    totalPosts: 150,
    totalEvents: 25,
    totalGroups: 12,
  };

  const recentPosts = [
    { id: 1, content: "Great lecture today!", author: "Alice Smith", reported: false },
    { id: 2, content: "Study group meeting at 3pm", author: "Bob Johnson", reported: false },
    { id: 3, content: "Inappropriate content example", author: "Charlie Wilson", reported: true },
  ];

  const handleDeletePost = async (postId: number) => {
    try {
      // In real app, call admin delete endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      // In real app, call admin ban endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Success",
        description: "User banned successfully",
      });
    } catch (error) {
      console.error("Failed to ban user:", error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{adminStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold">{adminStats.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{adminStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Groups</p>
                <p className="text-2xl font-bold">{adminStats.totalGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Moderation */}
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div 
                key={post.id} 
                className={`p-4 border rounded-lg ${post.reported ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-600 mb-1">
                      {post.author}
                      {post.reported && (
                        <span className="ml-2 text-red-600 text-xs">(Reported)</span>
                      )}
                    </p>
                    <p className="text-gray-900">{post.content}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBanUser(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* University Settings */}
      <Card>
        <CardHeader>
          <CardTitle>University Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="Your University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                className="w-20 h-10 border border-gray-300 rounded-md"
                defaultValue="#3B82F6"
              />
            </div>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
