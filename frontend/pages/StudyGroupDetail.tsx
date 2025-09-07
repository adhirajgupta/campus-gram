import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { 
  Users, Plus, UserPlus, Home, MessageCircle, Bell, User,
  BookOpen, GraduationCap, Calendar, MapPin, ArrowLeft, 
  UserMinus, Settings, MessageSquare
} from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function StudyGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch study group details
  const { data: studyGroups, isLoading } = useQuery({
    queryKey: ["studyGroups", user?.universityId],
    queryFn: () => backend.studygroups.list({
      universityId: user!.universityId,
      userId: user!.id,
    }),
    enabled: !!user,
  });

  // Find the specific study group
  const studyGroup = studyGroups?.studyGroups.find(group => group.id === parseInt(groupId || '0'));

  const joinMutation = useMutation({
    mutationFn: (groupId: number) =>
      backend.studygroups.join({ groupId, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      toast({
        title: "Success",
        description: "Joined study group!",
      });
    },
    onError: (error) => {
      console.error("Failed to join study group:", error);
      toast({
        title: "Error",
        description: "Failed to join study group",
        variant: "destructive",
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (groupId: number) =>
      backend.studygroups.leave({ groupId, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      toast({
        title: "Success",
        description: "Left study group!",
      });
    },
    onError: (error) => {
      console.error("Failed to leave study group:", error);
      toast({
        title: "Error",
        description: "Failed to leave study group",
        variant: "destructive",
      });
    },
  });

  const handleJoin = () => {
    if (studyGroup) {
      joinMutation.mutate(studyGroup.id);
    }
  };

  const handleLeave = () => {
    if (studyGroup) {
      leaveMutation.mutate(studyGroup.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <TopNavbar />
        <div className="min-h-screen pt-16">
          <div className="px-6 py-8 pb-24">
            <div className="text-center mb-6">
              <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
                loading study group...
              </h1>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-2 border-gray-400 rounded-lg p-4 animate-pulse" style={{ 
                  transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studyGroup) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <TopNavbar />
        <div className="min-h-screen pt-16">
          <div className="px-6 py-8 pb-24">
            <div className="text-center">
              <h1 className="text-lg text-gray-800 mb-4" style={{ transform: 'rotate(-0.5deg)' }}>
                study group not found
              </h1>
              <button
                onClick={() => navigate('/study-groups')}
                className="px-4 py-2 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                style={{ 
                  transform: 'rotate(0.3deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}
              >
                back to study groups
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/study-groups')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              style={{ transform: 'rotate(-0.2deg)' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>back to study groups</span>
            </button>
          </div>

          {/* Study Group Header */}
          <div className="border-2 border-gray-400 rounded-lg p-6 mb-6" style={{
            transform: 'rotate(0.2deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ transform: 'rotate(-0.3deg)' }}>
                  {studyGroup.name}
                </h1>
                {studyGroup.course && (
                  <p className="text-lg text-blue-600 font-medium mb-2" style={{ transform: 'rotate(0.1deg)' }}>
                    {studyGroup.course}
                  </p>
                )}
                {studyGroup.description && (
                  <p className="text-gray-600 mb-4" style={{ transform: 'rotate(-0.1deg)' }}>
                    {studyGroup.description}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {!studyGroup.isMember && studyGroup.memberCount < studyGroup.maxMembers && (
                  <button
                    onClick={handleJoin}
                    disabled={joinMutation.isPending}
                    className="px-4 py-2 border-2 border-gray-400 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1"
                    style={{ 
                      transform: 'rotate(-0.5deg)',
                      background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{joinMutation.isPending ? 'joining...' : 'join'}</span>
                  </button>
                )}
                
                {studyGroup.isMember && (
                  <button
                    onClick={handleLeave}
                    disabled={leaveMutation.isPending}
                    className="px-4 py-2 border-2 border-red-400 rounded-lg text-sm font-bold text-red-700 hover:bg-red-50 transition-colors flex items-center space-x-1"
                    style={{ 
                      transform: 'rotate(0.3deg)',
                      background: 'repeating-linear-gradient(45deg, #fef2f2, #fef2f2 2px, #fee2e2 2px, #fee2e2 4px)'
                    }}
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>{leaveMutation.isPending ? 'leaving...' : 'leave'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Group Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" style={{ transform: 'rotate(1deg)' }} />
                <span style={{ transform: 'rotate(-0.2deg)' }}>
                  {studyGroup.memberCount}/{studyGroup.maxMembers} members
                </span>
              </div>
              <div style={{ transform: 'rotate(0.3deg)' }}>
                created by {studyGroup.creator.fullName}
              </div>
            </div>

            {studyGroup.isMember && (
              <div className="mt-4">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-300"
                  style={{ transform: 'rotate(-0.1deg)' }}
                >
                  ✓ member
                </span>
              </div>
            )}
          </div>

          {/* Group Content Sections */}
          <div className="space-y-6">
            {/* Study Sessions */}
            <div className="border-2 border-gray-400 rounded-lg p-4" style={{
              transform: 'rotate(-0.1deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <h3 className="text-lg font-bold text-gray-800 mb-3" style={{ transform: 'rotate(0.2deg)' }}>
                study sessions
              </h3>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" style={{ transform: 'rotate(2deg)' }} />
                <p className="text-gray-500" style={{ transform: 'rotate(-0.3deg)' }}>
                  no study sessions scheduled yet
                </p>
              </div>
            </div>

            {/* Group Chat */}
            <div className="border-2 border-gray-400 rounded-lg p-4" style={{
              transform: 'rotate(0.1deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <h3 className="text-lg font-bold text-gray-800 mb-3" style={{ transform: 'rotate(-0.2deg)' }}>
                group chat
              </h3>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" style={{ transform: 'rotate(-1deg)' }} />
                <p className="text-gray-500" style={{ transform: 'rotate(0.3deg)' }}>
                  group chat coming soon
                </p>
              </div>
            </div>

            {/* Members List */}
            <div className="border-2 border-gray-400 rounded-lg p-4" style={{
              transform: 'rotate(-0.2deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}>
              <h3 className="text-lg font-bold text-gray-800 mb-3" style={{ transform: 'rotate(0.1deg)' }}>
                members ({studyGroup.memberCount})
              </h3>
              <div className="space-y-2">
                {/* Creator */}
                <div className="flex items-center space-x-3 p-2 border border-gray-300 rounded-lg" style={{ transform: 'rotate(0.1deg)' }}>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{studyGroup.creator.fullName}</p>
                    <p className="text-xs text-gray-500">creator</p>
                  </div>
                </div>
                
                {/* Placeholder for other members */}
                {studyGroup.memberCount > 1 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm" style={{ transform: 'rotate(-0.2deg)' }}>
                      +{studyGroup.memberCount - 1} other members
                    </p>
                  </div>
                )}
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
              <MessageCircle className="h-7 w-7 text-gray-600" style={{ transform: 'rotate(-2deg)' }} />
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
