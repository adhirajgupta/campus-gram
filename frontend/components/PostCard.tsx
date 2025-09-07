
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    imageUrls?: string[] | null;
    location?: string;
    hashtags: string[];
    createdAt: string | Date;
    user: {
      id: number;
      username: string;
      fullName: string;
      avatarUrl?: string;
      year?: number;
      major?: string;
    };
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
  };
  onLike: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const formatHashtags = (content: string) => {
    return content.replace(/#(\w+)/g, '<span class="text-blue-600 font-medium">#$1</span>');
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* User Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
            {post.user.avatarUrl ? (
              <img 
                src={post.user.avatarUrl} 
                alt={post.user.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-600" />
            )}
          </div>
          <div>
            <Link 
              to={`/u/${post.user.username}`}
              className="font-semibold hover:underline"
            >
              {post.user.fullName}
            </Link>
            <div className="text-sm text-gray-500">
              {post.user.major && post.user.year && (
                <span>{post.user.major} • Year {post.user.year} • </span>
              )}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p 
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatHashtags(post.content) }}
          />
        </div>

        {/* Images */}
        {post.imageUrls && Array.isArray(post.imageUrls) && post.imageUrls.length > 0 && (
          <div className="mb-4">
            {post.imageUrls.length === 1 ? (
              <img 
                src={post.imageUrls[0]} 
                alt="Post image"
                className="w-full rounded-lg max-h-96 object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {post.imageUrls.slice(0, 4).map((url, index) => (
                  <img 
                    key={index}
                    src={url} 
                    alt={`Post image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Location */}
        {post.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {post.location}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex items-center space-x-2 ${
              post.isLiked ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Heart className={`h-5 w-5 ${post.isLiked ? "fill-current" : ""}`} />
            <span>{post.likesCount}</span>
          </Button>

          <Link to={`/p/${post.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentsCount}</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
