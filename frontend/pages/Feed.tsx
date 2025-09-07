import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import PostCard from "../components/PostCard";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Bell, 
  ThumbsUp, 
  MessageCircle, 
  User, 
  Star,
  Home,
  Plus,
  X
} from "lucide-react";

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<string | undefined>();
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'MTF Jude, cursive' }}>
        <div className="text-center py-8">
          <p className="text-red-600 text-lg" style={{ transform: 'rotate(1deg)' }}>Failed to load posts</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-6 py-3 border-2 border-gray-600 rounded-lg font-bold text-lg"
            style={{ 
              transform: 'rotate(-0.5deg)',
              background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="min-h-screen">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              welcome, what's happening on campus?
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
              <input
                type="text"
                placeholder="search events"
                className="w-full h-12 pl-10 pr-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(0.3deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {['Event', 'Clubs', 'Outdoor', 'Eateri', 'Movies'].map((category, index) => (
              <button
                key={category}
                className="flex-shrink-0 px-4 py-2 border-2 border-gray-600 rounded-lg text-sm font-bold whitespace-nowrap"
                style={{ 
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.5}deg)`,
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
              >
                <div className="w-4 h-4 border border-gray-400 rounded mr-2 inline-block" style={{ transform: 'rotate(45deg)' }}>
                  <div className="w-full h-0.5 bg-gray-400 transform rotate-45 absolute top-1/2 left-0"></div>
                  <div className="w-full h-0.5 bg-gray-400 transform -rotate-45 absolute top-1/2 left-0"></div>
                </div>
                {category}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-6 text-sm text-gray-600">
            <span style={{ transform: 'rotate(-0.3deg)' }}>150k Posts</span>
            <span style={{ transform: 'rotate(0.2deg)' }}>30 Videos</span>
            <span style={{ transform: 'rotate(-0.1deg)' }}>15 Users</span>
          </div>

          {/* Divider */}
          <div className="w-full h-0.5 bg-gray-400 mb-6" style={{
            background: 'repeating-linear-gradient(90deg, #9ca3af 0%, transparent 20%, transparent 80%, #9ca3af 100%)'
          }}></div>

          {/* Content Grid */}
          <div className="space-y-4 mb-6">
            {isLoading && allPosts.length === 0 ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-2 border-gray-400 rounded-lg p-4" style={{ 
                    transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                    background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                  }}>
                    <div className="w-full h-32 bg-gray-300 rounded mb-2 relative">
                      <div className="absolute top-2 right-2 w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Posts Grid - Post Snapshots */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {allPosts.slice(0, 6).map((post, index) => (
                    <div
                      key={post.id}
                      className={`border-2 border-gray-400 rounded-lg p-2 relative cursor-pointer hover:bg-gray-50 transition-colors ${
                        index === 0 || index === 3 ? 'col-span-2' : ''
                      }`}
                      style={{ 
                        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.3}deg)`,
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Post Image or Content Preview */}
                      <div className="w-full h-20 bg-gray-200 rounded mb-2 relative overflow-hidden">
                        {post.imageUrls && post.imageUrls.length > 0 ? (
                          <img 
                            src={post.imageUrls[0]} 
                            alt="Post preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-1">
                            <p className="text-xs text-gray-600 text-center leading-tight" style={{ fontFamily: 'MTF Jude, cursive' }}>
                              {post.content?.substring(0, 20)}...
                            </p>
                          </div>
                        )}
                        
                        {/* Post Type Icons */}
                        {index === 0 && <Bell className="absolute top-1 right-1 h-4 w-4 text-gray-500" style={{ transform: 'rotate(5deg)' }} />}
                        {index === 2 && <ThumbsUp className="absolute top-1 right-1 h-4 w-4 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />}
                        {index === 5 && <MessageCircle className="absolute top-1 right-1 h-4 w-4 text-gray-500" style={{ transform: 'rotate(2deg)' }} />}
                        {index === 8 && <div className="absolute top-1 right-1 h-4 w-4 text-gray-500" style={{ transform: 'rotate(-2deg)' }}>
                          <User className="h-3 w-3" />
                          <Star className="h-2 w-2 absolute -top-1 -right-1" />
                        </div>}
                      </div>
                      
                      {/* Post Summary */}
                      <div className="text-xs text-gray-600" style={{ fontFamily: 'MTF Jude, cursive' }}>
                        <div className="h-2 bg-gray-300 rounded w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Post Cards for remaining posts */}
                {allPosts.slice(6).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => handleLike(post.id)}
                  />
                ))}

                       {/* Load More Button */}
                       {data?.nextCursor && (
                         <div className="text-center mb-4">
                           <button 
                             onClick={handleLoadMore}
                             disabled={isLoading}
                             className="text-lg font-bold text-gray-800 underline decoration-2 underline-offset-2"
                             style={{ 
                               transform: 'rotate(-0.5deg)',
                               textDecorationStyle: 'dashed'
                             }}
                           >
                             {isLoading ? "Loading..." : "Load more"}
                           </button>
                         </div>
                       )}

                {/* Empty State */}
                {allPosts.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg" style={{ transform: 'rotate(0.5deg)' }}>
                      No posts yet. Be the first to share something!
                    </p>
                  </div>
                )}
              </>
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
            <button onClick={() => navigate('/search')} className="hover:opacity-70 transition-opacity">
              <Search className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-2deg)' }} />
            </button>
            <button onClick={() => navigate('/compose')} className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-400 absolute -top-4 left-1/2 hover:bg-gray-200 transition-colors" style={{ 
              transform: 'translateX(-50%) rotate(2deg)',
              background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 2px, #f3f4f6 2px, #f3f4f6 4px)'
            }}>
              <Plus className="h-8 w-8 text-gray-500" style={{ transform: 'rotate(-1deg)' }} />
            </button>
            <button onClick={() => navigate('/events')} className="ml-20 hover:opacity-70 transition-opacity">
              <MessageCircle className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />
            </button>
            <button onClick={() => navigate(`/u/${user?.username}`)} className="hover:opacity-70 transition-opacity">
              <User className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
            </button>
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto border-2 border-gray-300" style={{ 
              transform: 'rotate(-0.5deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9fafb 2px, #f9fafb 4px)'
            }}>
              <div className="p-6">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Post Content */}
                <div className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800" style={{ fontFamily: 'MTF Jude, cursive' }}>
                        {selectedPost.author?.username || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'MTF Jude, cursive' }}>
                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Images */}
                  {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      {selectedPost.imageUrls.map((url: string, index: number) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Post image ${index + 1}`}
                          className="w-full rounded-lg border border-gray-300"
                        />
                      ))}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="text-gray-800" style={{ fontFamily: 'MTF Jude, cursive' }}>
                    {selectedPost.content}
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.commentCount || 0}</span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className="w-full py-2 px-4 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ 
                      transform: 'rotate(0.5deg)',
                      fontFamily: 'MTF Jude, cursive'
                    }}
                  >
                    {selectedPost.isLiked ? 'Unlike' : 'Like'} Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}