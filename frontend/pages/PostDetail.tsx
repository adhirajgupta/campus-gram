import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => backend.comments.list({ postId: parseInt(postId!) }),
    enabled: !!postId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; parentCommentId?: number }) =>
      backend.comments.create({
        postId: parseInt(postId!),
        userId: user!.id,
        content: data.content,
        parentCommentId: data.parentCommentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentContent("");
      toast({
        title: "Success",
        description: "Comment added!",
      });
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    createCommentMutation.mutate({ content: commentContent.trim() });
  };

  const handleReply = async (parentCommentId: number, content: string) => {
    createCommentMutation.mutate({ content, parentCommentId });
  };

  if (!postId) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Post would be displayed here - for now showing placeholder */}
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Post #{postId}</h1>
        <p className="text-gray-600">Post details would be displayed here.</p>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-lg p-6">
        <form onSubmit={handleComment} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!commentContent.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? "Commenting..." : "Comment"}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {comments?.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
            {comments?.comments.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
