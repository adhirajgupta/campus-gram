import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { User, Reply } from "lucide-react";

interface CommentCardProps {
  comment: {
    id: number;
    content: string;
    createdAt: string | Date;
    user: {
      id: number;
      username: string;
      fullName: string;
      avatarUrl?: string;
    };
    replies: Array<{
      id: number;
      content: string;
      createdAt: string | Date;
      user: {
        id: number;
        username: string;
        fullName: string;
        avatarUrl?: string;
      };
    }>;
  };
  onReply: (parentCommentId: number, content: string) => Promise<void>;
}

export default function CommentCard({ comment, onReply }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Main Comment */}
        <div className="flex items-start space-x-3">
          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {comment.user.avatarUrl ? (
              <img 
                src={comment.user.avatarUrl} 
                alt={comment.user.fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm">{comment.user.fullName}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-gray-900 mb-2">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs p-0 h-auto"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3 ml-11">
            <form onSubmit={handleReply} className="space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!replyContent.trim() || loading}
                >
                  {loading ? "Replying..." : "Reply"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-4 ml-11 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  {reply.user.avatarUrl ? (
                    <img 
                      src={reply.user.avatarUrl} 
                      alt={reply.user.fullName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3 w-3 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-xs">{reply.user.fullName}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-900">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
