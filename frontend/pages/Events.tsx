import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { 
  Calendar, Plus, MapPin, Clock, Home, Search, MessageCircle, User, Bell,
  Users, Heart, Filter, ChevronDown, ChevronUp, Image as ImageIcon
} from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EVENT_CATEGORIES = [
  { value: 'all', label: 'All Events' },
  { value: 'academic', label: 'Academic' },
  { value: 'social', label: 'Social' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'career', label: 'Career' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'general', label: 'General' },
];

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fonts = useFonts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    datetime: "",
    endDatetime: "",
    category: "general",
    maxAttendees: "",
    isPublic: true,
    imageUrl: "",
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", user?.universityId, selectedCategory],
    queryFn: () => backend.events.list({ 
      universityId: user!.universityId,
      userId: user!.id,
      category: selectedCategory === 'all' ? undefined : selectedCategory
    }),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      backend.events.create({
        universityId: user!.universityId,
        userId: user!.id,
        title: data.title,
        description: data.description || undefined,
        location: data.location || undefined,
        datetime: new Date(data.datetime),
        endDatetime: data.endDatetime ? new Date(data.endDatetime) : undefined,
        category: data.category,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : undefined,
        isPublic: data.isPublic,
        imageUrl: data.imageUrl || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsCreateDialogOpen(false);
      setFormData({ 
        title: "", description: "", location: "", datetime: "", 
        endDatetime: "", category: "general", maxAttendees: "", 
        isPublic: true, imageUrl: "" 
      });
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
    },
    onError: (error) => {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.datetime) return;
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <div className="min-h-screen">
          <div className="px-6 py-8 pb-24">
            <div className="text-center mb-6">
              <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
                campus events
              </h1>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-2 border-gray-400 rounded-lg p-4 animate-pulse" style={{ 
                  transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 8px, #f5f5f5 8px, #f5f5f5 16px)'
                }}>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = events?.events.filter(event => new Date(event.datetime) > new Date()) || [];
  const pastEvents = events?.events.filter(event => new Date(event.datetime) <= new Date()) || [];

  const getEventStatus = (eventDate: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    if (eventDay.getTime() === today.getTime()) return "today";
    if (eventDay.getTime() === tomorrow.getTime()) return "tomorrow";
    if (isAfter(eventDate, now)) return "upcoming";
    return "past";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today": return "text-red-600 bg-red-50 border-red-200";
      case "tomorrow": return "text-orange-600 bg-orange-50 border-orange-200";
      case "upcoming": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              campus events
            </Header>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full px-4 py-2 border-2 border-gray-400 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ 
                transform: 'rotate(0.3deg)',
                background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 8px, #f5f5f5 8px, #f5f5f5 16px)'
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              <Body className="text-sm">filter events</Body>
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>
            
            {showFilters && (
              <div className="mt-4 p-4 border-2 border-gray-300 rounded-lg" style={{ 
                transform: 'rotate(-0.2deg)',
                background: 'repeating-linear-gradient(45deg, #fafafa, #fafafa 8px, #f5f5f5 8px, #f5f5f5 16px)'
              }}>
                <div className="grid grid-cols-2 gap-2">
                  {EVENT_CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-colors ${
                        selectedCategory === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{ transform: 'rotate(0.1deg)' }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Create Event Button */}
          <div className="text-center mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-6 py-3 border-2 border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors" style={{ 
                  transform: 'rotate(0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 8px, #e0e0e0 8px, #e0e0e0 16px)'
                }}>
                  <Plus className="h-4 w-4 mr-2 inline" />
                  create event
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-primary">Create Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <Input
                    placeholder="Event title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                  <Input
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="datetime-local"
                      placeholder="Start time"
                      value={formData.datetime}
                      onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                      required
                    />
                    <Input
                      type="datetime-local"
                      placeholder="End time (optional)"
                      value={formData.endDatetime}
                      onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {EVENT_CATEGORIES.slice(1).map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Max attendees"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Image URL (optional)"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Public event
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const status = getEventStatus(new Date(event.datetime));
              return (
                <Card 
                  key={event.id} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-2 border-gray-400" 
                  style={{ 
                    transform: 'rotate(0.2deg)',
                    background: 'repeating-linear-gradient(45deg, #fafafa, #fafafa 8px, #f5f5f5 8px, #f5f5f5 16px)'
                  }}
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <span 
                            className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(status)}`}
                            style={{ transform: 'rotate(-1deg)' }}
                          >
                            {status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-300">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      {event.imageUrl && (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                          style={{ transform: 'rotate(2deg)' }}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {event.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" style={{ transform: 'rotate(1deg)' }} />
                        {format(new Date(event.datetime), "MMM do, h:mm a")}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" style={{ transform: 'rotate(-1deg)' }} />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {event.rsvpCounts.going}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {event.rsvpCounts.interested}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          by {event.creator.fullName}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {upcomingEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" style={{ transform: 'rotate(5deg)' }} />
                <Header className="text-lg text-gray-600 mb-2">No upcoming events</Header>
                <Body className="text-gray-500">Create the first event for your campus!</Body>
              </div>
            )}
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
              <Bell className="h-7 w-7 text-gray-600" style={{ transform: 'rotate(-3deg)' }} />
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
