import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, GraduationCap, BookOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // In a real app, you'd fetch the profile based on username
  // For now, showing current user's profile
  const isOwnProfile = user?.username === username;
  const profileUser = user;

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profileUser.fullName}</h1>
              <p className="text-gray-600">@{profileUser.username}</p>
              {profileUser.isAdmin && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                  Administrator
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profileUser.email}</span>
            </div>

            {profileUser.year && (
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Year {profileUser.year}</span>
              </div>
            )}

            {profileUser.major && (
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profileUser.major}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-8">
        <p className="text-gray-500">Posts and activity would be displayed here</p>
      </div>
    </div>
  );
}
