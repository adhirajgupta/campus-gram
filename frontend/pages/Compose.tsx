import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TopNavbar from "../components/TopNavbar";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import { 
  MapPin, Home, Search, Plus, MessageCircle, User, Bell,
  Image, Smile, Hash, Eye, X, Upload, Camera,
  Palette, Type, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Link, List, Quote
} from "lucide-react";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Compose() {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [textStyle, setTextStyle] = useState<'normal' | 'bold' | 'italic'>('normal');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [hashtagInput, setHashtagInput] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fonts = useFonts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Popular hashtags for suggestions
  const popularHashtags = [
    'campuslife', 'study', 'exams', 'friends', 'fun', 'learning', 'college',
    'university', 'student', 'education', 'community', 'events', 'social',
    'academic', 'research', 'career', 'networking', 'volunteer', 'sports',
    'music', 'art', 'culture', 'diversity', 'wellness', 'fitness', 'food'
  ];

  // Emoji picker data
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
    '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
    '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾'
  ];

  // Image handling functions
  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 5 - images.length); // Max 5 images
    const newImageUrls = newImages.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...newImages]);
    setImageUrls(prev => [...prev, ...newImageUrls]);
  }, [images.length]);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  // Text formatting functions
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);
      setShowEmojiPicker(false);
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
  };

  const insertHashtag = (hashtag: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const hashtagText = content.includes('#') ? ` #${hashtag}` : `#${hashtag}`;
      const newContent = content.substring(0, start) + hashtagText + content.substring(end);
      setContent(newContent);
      setShowHashtagSuggestions(false);
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + hashtagText.length, start + hashtagText.length);
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      // For now, we'll use placeholder image URLs since we don't have a file upload service
      // In a real app, you'd upload images to a service like AWS S3, Cloudinary, etc.
      const uploadedImageUrls = images.map((_, index) => 
        `https://picsum.photos/400/300?random=${Date.now()}-${index}`
      );

      await backend.posts.create({
        content: content.trim(),
        imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
        location: location.trim() || undefined,
        universityId: user.universityId,
        userId: user.id,
      });

      // Invalidate posts query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      navigate("/feed");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={fonts.primary}>
      <TopNavbar />
      <div className="min-h-screen pt-16">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <Header className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              create a post
            </Header>
          </div>

          {/* Post Form */}
          <div className="border-2 border-gray-400 rounded-lg p-6" style={{
            transform: 'rotate(0.5deg)',
            background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
          }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Text Formatting Toolbar */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-300" style={{ transform: 'rotate(-0.2deg)' }}>
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`p-2 rounded ${textAlign === 'left' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`p-2 rounded ${textAlign === 'center' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`p-2 rounded ${textAlign === 'right' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  onClick={() => setTextStyle(textStyle === 'bold' ? 'normal' : 'bold')}
                  className={`p-2 rounded ${textStyle === 'bold' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextStyle(textStyle === 'italic' ? 'normal' : 'italic')}
                  className={`p-2 rounded ${textStyle === 'italic' ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowHashtagSuggestions(!showHashtagSuggestions)}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Hash className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 max-h-40 overflow-y-auto" style={{ transform: 'rotate(0.3deg)' }}>
                  <div className="grid grid-cols-10 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 hover:bg-gray-200 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtag Suggestions */}
              {showHashtagSuggestions && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 max-h-40 overflow-y-auto" style={{ transform: 'rotate(-0.3deg)' }}>
                  <div className="grid grid-cols-3 gap-2">
                    {popularHashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertHashtag(hashtag)}
                        className="p-2 text-sm hover:bg-gray-200 rounded border border-gray-300"
                      >
                        #{hashtag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div>
                <textarea
                  ref={textareaRef}
                  placeholder="what's happening on campus?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="doodle w-full p-3 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800 resize-none"
                  style={{ 
                    transform: 'rotate(-0.3deg)',
                    textAlign: textAlign,
                    fontWeight: textStyle === 'bold' ? 'bold' : 'normal',
                    fontStyle: textStyle === 'italic' ? 'italic' : 'normal'
                  }}
                />
                <div className="text-right text-sm text-gray-500 mt-1" style={{ transform: 'rotate(0.2deg)' }}>
                  {content.length}/500
                </div>
              </div>

              {/* Image Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ transform: 'rotate(0.2deg)' }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    {images.length === 0 ? 'click or drag images here' : `${images.length} image(s) selected`}
                  </p>
                  <p className="text-xs text-gray-500">max 5 images</p>
                </div>
              </div>

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2" style={{ transform: 'rotate(-0.1deg)' }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Location Input */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" style={{ transform: 'rotate(1deg)' }} />
                <input
                  type="text"
                  placeholder="add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="doodle flex-1 p-2 border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                  style={{ transform: 'rotate(-0.5deg)' }}
                />
              </div>

              {/* Post Preview */}
              {showPreview && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300" style={{ transform: 'rotate(0.1deg)' }}>
                  <h3 className="text-sm font-bold mb-2">Preview:</h3>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">@{user?.username}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2" style={{ textAlign: textAlign, fontWeight: textStyle === 'bold' ? 'bold' : 'normal', fontStyle: textStyle === 'italic' ? 'italic' : 'normal' }}>
                      {content || 'Your post content will appear here...'}
                    </p>
                    {imageUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {imageUrls.map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-20 object-cover rounded border border-gray-200" 
                            onError={(e) => {
                              // Fallback for broken image URLs
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {location && (
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500" style={{ transform: 'rotate(0.3deg)' }}>
                  use #hashtags to categorize your post
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !content.trim()}
                  className="px-6 py-2 border-2 border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  style={{ 
                    transform: 'rotate(-0.5deg)',
                    background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)'
                  }}
                >
                  {loading ? "posting..." : "post"}
                </button>
              </div>
            </form>
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
              <MessageCircle className="h-7 w-7 text-gray-500" style={{ transform: 'rotate(-2deg)' }} />
            </button>
            <button onClick={() => navigate('/compose')} className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-400 absolute -top-4 left-1/2 hover:bg-gray-300 transition-colors" style={{ 
              transform: 'translateX(-50%) rotate(2deg)',
              background: 'repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 2px, #d1d5db 2px, #d1d5db 4px)'
            }}>
              <Plus className="h-8 w-8 text-gray-600" style={{ transform: 'rotate(-1deg)' }} />
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
