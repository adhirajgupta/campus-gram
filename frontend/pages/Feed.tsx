import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import PostCard from "../components/PostCard";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
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
  X,
  MapPin,
  Send
} from "lucide-react";

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fonts = useFonts();
  const [cursor, setCursor] = useState<string | undefined>();
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", user?.universityId, cursor],
    queryFn: () => backend.posts.list({
      universityId: user!.universityId,
      userId: user!.id,
      cursor,
      limit: 10,
    }),
    enabled: !!user,
    refetchOnWindowFocus: true, // Refetch when returning to the page
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

  // Refetch posts when component mounts (e.g., returning from compose page)
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // Comments query
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ["comments", selectedPost?.id],
    queryFn: () => backend.comments.list({ postId: selectedPost!.id }),
    enabled: !!selectedPost && showComments,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => backend.comments.create({
      postId: selectedPost!.id,
      userId: user!.id,
      content: content.trim(),
    }),
    onSuccess: () => {
      setNewComment("");
      refetchComments();
      // Update post comments count
      setAllPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      ));
      if (selectedPost) {
        setSelectedPost((prev: any) => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
      }
      toast({
        title: "Success",
        description: "Comment added successfully!",
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
      
      // Update selected post if it's the same
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev: any) => prev ? { ...prev, isLiked: result.liked, likesCount: result.likesCount } : null);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !selectedPost) return;
    
    createCommentMutation.mutate(newComment);
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
              background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 8px, #e0e0e0 8px, #e0e0e0 16px)'
            }}
          >
            Try Again
          </button>
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
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              welcome, what's happening on campus?
            </Header>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="mt-2 text-sm text-gray-600 underline decoration-1 underline-offset-2 hover:text-gray-800"
              style={{ transform: 'rotate(0.3deg)' }}
            >
              <Small>{isLoading ? 'refreshing...' : 'refresh'}</Small>
            </button>
          </div>


          {/* Category Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {['Event', 'Clubs', 'Outdoor', 'Eateri', 'Movies'].map((category, index) => (
              <button
                key={category}
                className="flex-shrink-0 px-4 py-2 border-2 border-gray-600 rounded-lg text-sm font-bold whitespace-nowrap"
                style={{ 
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 0.5}deg)`,
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, #fafafa 8px, #fafafa 16px)'
                }}
              >
                <div className="w-4 h-4 border border-gray-400 rounded mr-2 inline-block" style={{ transform: 'rotate(45deg)' }}>
                  <div className="w-full h-0.5 bg-gray-400 transform rotate-45 absolute top-1/2 left-0"></div>
                  <div className="w-full h-0.5 bg-gray-400 transform -rotate-45 absolute top-1/2 left-0"></div>
                </div>
                <Small>{category}</Small>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-between mb-6 text-sm text-gray-600">
            <Accent style={{ transform: 'rotate(-0.3deg)' }}>150k Posts</Accent>
            <Accent style={{ transform: 'rotate(0.2deg)' }}>30 Videos</Accent>
            <Accent style={{ transform: 'rotate(-0.1deg)' }}>15 Users</Accent>
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
                    background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 8px, #f5f5f5 8px, #f5f5f5 16px)'
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
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, #fafafa 8px, #fafafa 16px)'
                      }}
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Post Image or Content Preview */}
                      <div className="w-full h-20 bg-gray-200 rounded mb-2 relative overflow-hidden">
                        {post.imageUrls && Array.isArray(post.imageUrls) && post.imageUrls.length > 0 ? (
                          <img 
                            src={post.imageUrls[0]} 
                            alt="Post preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide image if it fails to load and show content instead
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center p-1">
                                    <p class="text-xs text-gray-600 text-center leading-tight" style="font-family: 'MTF Jude', cursive;">
                                      ${post.content?.substring(0, 20)}...
                                    </p>
                                  </div>
                                `;
                              }
                            }}
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
                        <p className="line-clamp-2 leading-tight">
                          {post.content?.substring(0, 50)}...
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {post.likesCount} likes
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.commentsCount} comments
                          </span>
                        </div>
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
          background: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 8px, #f0f1f3 8px, #f0f1f3 16px)',
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
              <Bell className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-3deg)' }} />
            </button>
            <button onClick={() => navigate(`/u/${user?.username}`)} className="hover:opacity-70 transition-opacity">
              <User className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
            </button>
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto border-2 border-gray-300 relative" style={{ 
              transform: 'rotate(-0.5deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 8px, #fafafa 8px, #fafafa 16px)'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                style={{ transform: 'rotate(2deg)' }}
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="p-6">

                {/* Post Content */}
                <div className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800" style={{ fontFamily: 'MTF Jude, cursive' }}>
                        {selectedPost.user?.fullName || selectedPost.user?.username || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'MTF Jude, cursive' }}>
                        @{selectedPost.user?.username || 'unknown'} • {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Images */}
                  {(() => {
                    // Debug: Log imageUrls to see what we're getting
                    console.log('Post imageUrls:', selectedPost.imageUrls, typeof selectedPost.imageUrls);
                    
                    // Handle different possible formats
                    let imageUrls = selectedPost.imageUrls;
                    if (typeof imageUrls === 'string') {
                      try {
                        imageUrls = JSON.parse(imageUrls);
                      } catch (e) {
                        console.error('Failed to parse imageUrls:', e);
                        imageUrls = [];
                      }
                    }
                    
                    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                      return (
                        <div className="space-y-2">
                          {imageUrls.map((url: string, index: number) => (
                            <img 
                              key={index}
                              src={url} 
                              alt={`Post image ${index + 1}`}
                              className="w-full rounded-lg border border-gray-300"
                              onError={(e) => {
                                console.error('Image failed to load:', url);
                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                              }}
                            />
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Post Content */}
                  <Body className="text-gray-800">
                    {selectedPost.content}
                  </Body>

                  {/* Location */}
                  {selectedPost.location && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <Small>{selectedPost.location}</Small>
                    </div>
                  )}

                  {/* Hashtags */}
                  {selectedPost.hashtags && Array.isArray(selectedPost.hashtags) && selectedPost.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedPost.hashtags.map((hashtag: string, index: number) => (
                        <Accent 
                          key={index}
                          className="text-blue-600 text-sm"
                        >
                          #{hashtag}
                        </Accent>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{selectedPost.commentsCount || 0}</span>
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

                  {/* Comments Section */}
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="w-full py-2 px-4 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors mb-4"
                      style={{ 
                        transform: 'rotate(-0.3deg)',
                        fontFamily: 'MTF Jude, cursive'
                      }}
                    >
                      {showComments ? 'Hide' : 'Show'} Comments ({selectedPost.commentsCount || 0})
                    </button>

                    {showComments && (
                      <div className="space-y-4">
                        {/* Add Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="space-y-2">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            className="w-full p-2 border-2 border-gray-400 rounded-lg resize-none"
                            style={{ 
                              transform: 'rotate(0.2deg)',
                              fontFamily: 'MTF Jude, cursive'
                            }}
                          />
                          <button
                            type="submit"
                            disabled={!newComment.trim() || createCommentMutation.isPending}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 border-2 border-gray-400 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                            style={{ 
                              transform: 'rotate(-0.2deg)',
                              fontFamily: 'MTF Jude, cursive'
                            }}
                          >
                            <Send className="h-4 w-4" />
                            <span>{createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}</span>
                          </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {commentsData?.comments?.map((comment: any) => (
                            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200" style={{ 
                              transform: 'rotate(0.1deg)',
                              fontFamily: 'MTF Jude, cursive'
                            }}>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {comment.user?.fullName || comment.user?.username || 'Anonymous'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                          
                          {commentsData?.comments?.length === 0 && (
                            <p className="text-center text-gray-500 text-sm" style={{ fontFamily: 'MTF Jude, cursive' }}>
                              No comments yet. Be the first to comment!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}