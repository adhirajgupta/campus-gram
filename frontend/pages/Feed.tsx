import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PostCard from "../components/PostCard";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cursor, setCursor] = useState<string | undefined>();
  const [allPosts, setAllPosts] = useState<any[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", user?.universityId, cursor],
    queryFn: () => backend.posts.list({
      universityId: user!.universityId,
      userId: user!.id,
      cursor,
      limit: 10,
    }),
    enabled: !!user,
  });

  useEffect(() => {
    if (data) {
      if (cursor) {
        setAllPosts(prev => [...prev, ...data.posts]);
      } else {
        setAllPosts(data.posts);
      }
    }
  }, [data, cursor]);

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      const result = await backend.posts.toggleLike({
        postId,
        userId: user.id,
      });

      setAllPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: result.liked, likesCount: result.likesCount }
          : post
      ));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load posts</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Campus Feed</h1>
      
      {isLoading && allPosts.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}

          {data?.nextCursor && (
            <div className="text-center">
              <Button 
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {allPosts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
