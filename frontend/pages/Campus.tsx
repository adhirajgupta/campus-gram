import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Calendar, FileText } from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Campus() {
  const { user } = useAuth();

  // Mock campus stats - in real app, you'd have an endpoint for this
  const campusStats = {
    totalStudents: 1200,
    activeGroups: 15,
    upcomingEvents: 8,
    posts: 450,
  };

  const campusLocations = [
    "Main Quad",
    "Library",
    "Student Union", 
    "Science Building",
    "Engineering Hall",
    "Arts Center",
    "Dining Hall",
    "Recreation Center",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Campus Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold">{campusStats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Groups</p>
                <p className="text-2xl font-bold">{campusStats.activeGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-2xl font-bold">{campusStats.upcomingEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posts</p>
                <p className="text-2xl font-bold">{campusStats.posts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Campus Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {campusLocations.map((location) => (
              <div
                key={location}
                className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <p className="font-medium text-sm">{location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* University Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>University Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Campus:</span> Your University</p>
              <p><span className="font-medium">Student ID:</span> {user.id}</p>
              <p><span className="font-medium">Year:</span> {user.year || "Not specified"}</p>
              <p><span className="font-medium">Major:</span> {user.major || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
