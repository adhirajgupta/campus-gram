import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { 
  Users, Plus, UserPlus, Home, MessageCircle, Bell, User,
  BookOpen, GraduationCap, Calendar, MapPin
} from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function StudyGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fonts = useFonts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    description: "",
    maxMembers: "",
  });

  const { data: studyGroups, isLoading } = useQuery({
    queryKey: ["studyGroups", user?.universityId],
    queryFn: () => backend.studygroups.list({
      universityId: user!.universityId,
      userId: user!.id,
    }),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      backend.studygroups.create({
        universityId: user!.universityId,
        userId: user!.id,
        name: data.name,
        course: data.course || undefined,
        description: data.description || undefined,
        maxMembers: data.maxMembers ? parseInt(data.maxMembers) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyGroups"] });
      setIsCreateDialogOpen(false);
      setFormData({ name: "", course: "", description: "", maxMembers: "" });
      toast({
        title: "Success",
        description: "Study group created successfully!",
      });
    },
    onError: (error) => {
      console.error("Failed to create study group:", error);
      toast({
        title: "Error",
        description: "Failed to create study group",
        variant: "destructive",
      });
    },
  });

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    createMutation.mutate(formData);
  };

  const handleJoin = (groupId: number) => {
    joinMutation.mutate(groupId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <div className="min-h-screen">
          <div className="px-6 py-8 pb-24">
            <div className="text-center mb-6">
              <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
                study groups
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

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              study groups
            </Header>
          </div>

          {/* Create Group Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full py-3 px-4 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              style={{ 
                transform: 'rotate(0.3deg)',
                background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
              }}
            >
              <Plus className="h-5 w-5" />
              <span>create study group</span>
            </button>
          </div>

          {/* Study Groups List */}
          <div className="space-y-4">
            {studyGroups?.studyGroups.map((group, index) => (
              <div
                key={group.id}
                className="border-2 border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ 
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
                onClick={() => navigate(`/study-group/${group.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800" style={{ transform: 'rotate(-0.2deg)' }}>
                      {group.name}
                    </h3>
                    {group.course && (
                      <p className="text-sm text-blue-600 font-medium" style={{ transform: 'rotate(0.1deg)' }}>
                        {group.course}
                      </p>
                    )}
                  </div>
                  {!group.isMember && group.memberCount < group.maxMembers && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoin(group.id);
                      }}
                      disabled={joinMutation.isPending}
                      className="px-3 py-1 border-2 border-gray-400 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1"
                      style={{ 
                        transform: 'rotate(-0.5deg)',
                        background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{joinMutation.isPending ? 'joining...' : 'join'}</span>
                    </button>
                  )}
                </div>

                {group.description && (
                  <p className="text-gray-600 mb-3 text-sm" style={{ transform: 'rotate(0.1deg)' }}>
                    {group.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" style={{ transform: 'rotate(1deg)' }} />
                    <span style={{ transform: 'rotate(-0.2deg)' }}>
                      {group.memberCount}/{group.maxMembers} members
                    </span>
                  </div>
                  <div style={{ transform: 'rotate(0.3deg)' }}>
                    by {group.creator.fullName}
                  </div>
                </div>

                {group.isMember && (
                  <div className="mt-3">
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-300"
                      style={{ transform: 'rotate(-0.1deg)' }}
                    >
                      member
                    </span>
                  </div>
                )}
              </div>
            ))}

            {studyGroups?.studyGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" style={{ transform: 'rotate(2deg)' }} />
                <p className="text-gray-500" style={{ transform: 'rotate(-0.3deg)' }}>
                  no study groups yet. create the first one!
                </p>
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

        {/* Create Group Modal */}
        {isCreateDialogOpen && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto border-2 border-gray-300 relative" style={{ 
              transform: 'rotate(-0.5deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9fafb 2px, #f9fafb 4px)'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setIsCreateDialogOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                style={{ transform: 'rotate(2deg)' }}
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ transform: 'rotate(-0.3deg)' }}>
                  create study group
                </h2>
                
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="group name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full p-3 border-2 border-gray-400 rounded-lg bg-white focus:outline-none focus:border-gray-600"
                      style={{ 
                        transform: 'rotate(0.2deg)',
                        fontFamily: 'MTF Jude, cursive'
                      }}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="course (optional)"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full p-3 border-2 border-gray-400 rounded-lg bg-white focus:outline-none focus:border-gray-600"
                      style={{ 
                        transform: 'rotate(-0.1deg)',
                        fontFamily: 'MTF Jude, cursive'
                      }}
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full p-3 border-2 border-gray-400 rounded-lg bg-white focus:outline-none focus:border-gray-600 resize-none"
                      style={{ 
                        transform: 'rotate(0.1deg)',
                        fontFamily: 'MTF Jude, cursive'
                      }}
                    />
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      placeholder="max members (default: 10)"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                      min="2"
                      max="50"
                      className="w-full p-3 border-2 border-gray-400 rounded-lg bg-white focus:outline-none focus:border-gray-600"
                      style={{ 
                        transform: 'rotate(-0.2deg)',
                        fontFamily: 'MTF Jude, cursive'
                      }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full py-3 px-4 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    style={{ 
                      transform: 'rotate(0.3deg)',
                      background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                    }}
                  >
                    {createMutation.isPending ? "creating..." : "create group"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
