import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Heart, 
  MessageCircle,
  Users,
  Home,
  Search,
  Bell,
  Plus
} from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fonts = useFonts();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", eventId, user?.id],
    queryFn: () => backend.events.get({ eventId: parseInt(eventId!), userId: user?.id }),
    enabled: !!eventId,
  });

  const queryClient = useQueryClient();

  const rsvpMutation = useMutation({
    mutationFn: (status: 'going' | 'interested' | 'not_going') =>
      backend.events.rsvp({ 
        eventId: parseInt(eventId!), 
        userId: user!.id, 
        status 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "RSVP updated!",
        description: "Your response has been recorded.",
      });
    },
    onError: (error) => {
      console.error("Failed to update RSVP:", error);
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" style={fonts.primary}>
        <TopNavbar />
        <div className="min-h-screen pt-16">
          <div className="px-6 py-8 pb-24">
            <div className="text-center mb-6">
              <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
                loading event...
              </Header>
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white" style={fonts.primary}>
        <TopNavbar />
        <div className="min-h-screen pt-16">
          <div className="px-6 py-8 pb-24">
            <div className="text-center mb-6">
              <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
                event not found
              </Header>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => navigate('/events')}
                className="px-6 py-3 border-2 border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors" 
                style={{ 
                  transform: 'rotate(0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 8px, #e0e0e0 8px, #e0e0e0 16px)'
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                back to events
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.datetime);
  const isUpcoming = isAfter(eventDate, new Date());
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isTomorrow = eventDate.toDateString() === addDays(new Date(), 1).toDateString();

  const getEventStatus = () => {
    if (isToday) return "today";
    if (isTomorrow) return "tomorrow";
    if (isUpcoming) return "upcoming";
    return "past";
  };

  const getStatusColor = () => {
    const status = getEventStatus();
    switch (status) {
      case "today": return "text-red-600 bg-red-50 border-red-200";
      case "tomorrow": return "text-orange-600 bg-orange-50 border-orange-200";
      case "upcoming": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description || `Join us for ${event.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200" style={{
          background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 8px, #f7f8fa 8px, #f7f8fa 16px)'
        }}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/events')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" style={{ transform: 'rotate(-1deg)' }} />
              <Body className="text-sm">back</Body>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-2" style={{ transform: 'rotate(1deg)' }} />
              <Body className="text-sm">share</Body>
            </button>
          </div>
        </div>

        {/* Event Content */}
        <div className="px-6 py-8 pb-24">
          {/* Event Status Badge */}
          <div className="text-center mb-6">
            <span 
              className={`inline-block px-4 py-2 rounded-full border-2 text-sm font-bold ${getStatusColor()}`}
              style={{ 
                transform: 'rotate(-1deg)',
                background: 'repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 2px)',
                backgroundSize: '4px 4px',
                opacity: 0.1
              }}
            >
              {getEventStatus()}
            </span>
          </div>

          {/* Event Title */}
          <div className="text-center mb-6">
            <Header className="text-2xl text-gray-800 mb-2" style={{ transform: 'rotate(-0.5deg)' }}>
              {event.title}
            </Header>
            <div className="flex items-center justify-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" style={{ transform: 'rotate(2deg)' }} />
              <Small className="text-sm">
                {format(eventDate, "EEEE, MMMM do, yyyy")}
              </Small>
            </div>
          </div>

          {/* Event Details Card */}
          <Card className="mb-6 border-2 border-gray-400" style={{ 
            transform: 'rotate(0.3deg)',
            background: 'repeating-linear-gradient(45deg, #fafafa, #fafafa 8px, #f5f5f5 8px, #f5f5f5 16px)'
          }}>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800" style={{ transform: 'rotate(-0.2deg)' }}>
                event details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date & Time */}
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(1deg)' }} />
                <div>
                  <Body className="text-sm font-medium text-gray-800">
                    {format(eventDate, "EEEE, MMMM do, yyyy")}
                  </Body>
                  <Small className="text-sm text-gray-600">
                    {format(eventDate, "h:mm a")}
                  </Small>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(-1deg)' }} />
                  <div>
                    <Body className="text-sm font-medium text-gray-800">
                      {event.location}
                    </Body>
                  </div>
                </div>
              )}

              {/* Creator */}
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(0.5deg)' }} />
                <div>
                  <Body className="text-sm font-medium text-gray-800">
                    created by {event.creator.fullName}
                  </Body>
                  <Small className="text-sm text-gray-600">
                    @{event.creator.username}
                  </Small>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {event.description && (
            <Card className="mb-6 border-2 border-gray-400" style={{ 
              transform: 'rotate(-0.2deg)',
              background: 'repeating-linear-gradient(45deg, #fafafa, #fafafa 8px, #f5f5f5 8px, #f5f5f5 16px)'
            }}>
              <CardHeader>
                <CardTitle className="text-lg text-gray-800" style={{ transform: 'rotate(0.1deg)' }}>
                  about this event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Body className="text-gray-700 leading-relaxed">
                  {event.description}
                </Body>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* RSVP Buttons */}
            {isUpcoming ? (
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => rsvpMutation.mutate('going')}
                  disabled={rsvpMutation.isPending}
                  className={`py-3 border-2 rounded-lg font-medium transition-colors ${
                    event.userRsvp === 'going' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-400 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ 
                    transform: 'rotate(0.3deg)',
                    background: event.userRsvp === 'going' 
                      ? 'repeating-linear-gradient(45deg, #f0fdf4, #f0fdf4 2px, #dcfce7 2px, #dcfce7 4px)'
                      : 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #f0f0f0 2px, #f0f0f0 4px)'
                  }}
                >
                  <Users className="h-4 w-4 mr-1 inline" />
                  going
                </Button>
                <Button 
                  onClick={() => rsvpMutation.mutate('interested')}
                  disabled={rsvpMutation.isPending}
                  className={`py-3 border-2 rounded-lg font-medium transition-colors ${
                    event.userRsvp === 'interested' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-400 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ 
                    transform: 'rotate(-0.2deg)',
                    background: event.userRsvp === 'interested' 
                      ? 'repeating-linear-gradient(45deg, #eff6ff, #eff6ff 2px, #dbeafe 2px, #dbeafe 4px)'
                      : 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #f0f0f0 2px, #f0f0f0 4px)'
                  }}
                >
                  <Heart className="h-4 w-4 mr-1 inline" />
                  interested
                </Button>
                <Button 
                  onClick={() => rsvpMutation.mutate('not_going')}
                  disabled={rsvpMutation.isPending}
                  className={`py-3 border-2 rounded-lg font-medium transition-colors ${
                    event.userRsvp === 'not_going' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-400 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ 
                    transform: 'rotate(0.1deg)',
                    background: event.userRsvp === 'not_going' 
                      ? 'repeating-linear-gradient(45deg, #fef2f2, #fef2f2 2px, #fecaca 2px, #fecaca 4px)'
                      : 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #f0f0f0 2px, #f0f0f0 4px)'
                  }}
                >
                  <Calendar className="h-4 w-4 mr-1 inline" />
                  can't go
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Body className="text-gray-500">This event has ended</Body>
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-400 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors" 
                style={{ 
                  transform: 'rotate(-0.3deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #f0f0f0 2px, #f0f0f0 4px)'
                }}
              >
                <Share2 className="h-4 w-4 mr-2 inline" />
                share
              </Button>
              <Button 
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-400 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors" 
                style={{ 
                  transform: 'rotate(0.2deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #f0f0f0 2px, #f0f0f0 4px)'
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2 inline" />
                discuss
              </Button>
            </div>
          </div>

          {/* Event Stats */}
          <Card className="mt-6 border-2 border-gray-400" style={{ 
            transform: 'rotate(-0.1deg)',
            background: 'repeating-linear-gradient(45deg, #fafafa, #fafafa 8px, #f5f5f5 8px, #f5f5f5 16px)'
          }}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600" style={{ transform: 'rotate(1deg)' }}>
                    {event.rsvpCounts.going}
                  </div>
                  <Small className="text-gray-600">going</Small>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600" style={{ transform: 'rotate(-0.5deg)' }}>
                    {event.rsvpCounts.interested}
                  </div>
                  <Small className="text-gray-600">interested</Small>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600" style={{ transform: 'rotate(0.8deg)' }}>
                    {event.rsvpCounts.notGoing}
                  </div>
                  <Small className="text-gray-600">can't go</Small>
                </div>
              </div>
            </CardContent>
          </Card>
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
              background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 8px, #f7f8fa 8px, #f7f8fa 16px)'
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
