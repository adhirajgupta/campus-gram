import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, User, FileText, MapPin } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import backend from "~backend/client";
import { useAuth } from "../contexts/AuthContext";

export default function Search() {
  const { user } = useAuth();
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users, posts, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {query.trim().length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Enter a search term to find users, posts, and locations</p>
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
  );
}
