import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus, UserPlus } from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function StudyGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Groups</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                placeholder="Group name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="Course (optional)"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
              <Input
                type="number"
                placeholder="Max members (default: 10)"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                min="2"
                max="50"
              />
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Group"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {studyGroups?.studyGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  {group.course && (
                    <p className="text-sm text-blue-600 font-medium">{group.course}</p>
                  )}
                </div>
                {!group.isMember && group.memberCount < group.maxMembers && (
                  <Button
                    size="sm"
                    onClick={() => handleJoin(group.id)}
                    disabled={joinMutation.isPending}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {group.description && (
                <p className="text-gray-600 mb-3">{group.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.memberCount}/{group.maxMembers} members
                </div>
                <div>
                  Created by {group.creator.fullName}
                </div>
              </div>
              {group.isMember && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Member
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {studyGroups?.studyGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No study groups yet. Create the first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
