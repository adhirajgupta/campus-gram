import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, User, FileText, MapPin, Home, Plus, MessageCircle } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Search() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", user?.universityId, debouncedQuery, activeTab],
    queryFn: () => backend.search.search({
      universityId: user!.universityId,
      query: debouncedQuery,
      type: activeTab === "all" ? undefined : activeTab,
    }),
    enabled: !!user && debouncedQuery.trim().length > 0,
  });

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="min-h-screen">
        {/* Content */}
        <div className="px-6 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg text-gray-800" style={{ transform: 'rotate(-0.5deg)' }}>
              search campus
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" style={{ transform: 'rotate(2deg)' }} />
              <input
                type="text"
                placeholder="search users, posts, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="doodle w-full h-12 pl-10 pr-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ transform: 'rotate(0.5deg)' }}
              />
            </div>
          </div>

          {query.trim().length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" style={{ transform: 'rotate(2deg)' }} />
              <p className="text-gray-500" style={{ transform: 'rotate(-0.5deg)' }}>enter a search term to find users, posts, and locations</p>
            </div>
          ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults?.users && searchResults.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Users
                    </h3>
                    <div className="space-y-2">
                      {searchResults.users.map((user) => (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                {user.avatarUrl ? (
                                  <img 
                                    src={user.avatarUrl} 
                                    alt={user.fullName}
                                    className="h-full w-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{user.fullName}</p>
                                <p className="text-sm text-gray-500">
                                  @{user.username}
                                  {user.major && user.year && (
                                    <span> • {user.major} • Year {user.year}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults?.posts && searchResults.posts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Posts
                    </h3>
                    <div className="space-y-2">
                      {searchResults.posts.map((post) => (
                        <Card key={post.id}>
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600 mb-2">
                              by {post.user.fullName}
                            </p>
                            <p className="text-gray-900">{post.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults?.locations && searchResults.locations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Locations
                    </h3>
                    <div className="space-y-2">
                      {searchResults.locations.map((location) => (
                        <Card key={location.id}>
                          <CardContent className="p-4">
                            <p className="font-medium">{location.name}</p>
                            {location.description && (
                              <p className="text-sm text-gray-600">{location.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults && 
                 searchResults.users.length === 0 && 
                 searchResults.posts.length === 0 && 
                 searchResults.locations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No results found for "{query}"</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            {/* Users only view */}
            <div className="space-y-2">
              {searchResults?.users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.fullName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                          {user.major && user.year && (
                            <span> • {user.major} • Year {user.year}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts">
            {/* Posts only view */}
            <div className="space-y-2">
              {searchResults?.posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      by {post.user.fullName}
                    </p>
                    <p className="text-gray-900">{post.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locations">
            {/* Locations only view */}
            <div className="space-y-2">
              {searchResults?.locations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{location.name}</p>
                    {location.description && (
                      <p className="text-sm text-gray-600">{location.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          </Tabs>
          )}
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
              <SearchIcon className="h-7 w-7 text-gray-600" style={{ transform: 'rotate(-2deg)' }} />
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
      </div>
    </div>
  );
}
