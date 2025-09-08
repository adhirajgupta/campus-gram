import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Users, 
  Calendar,
  Code,
  Palette,
  Zap,
  Globe,
  Package,
  CheckCircle,
  XCircle,
  Settings,
  Play
} from 'lucide-react';
import Layout from '../components/Layout';

// Mock plugin data
const mockPlugins = [
  {
    id: 1,
    name: "Campus Events Calendar",
    description: "Advanced calendar system with event management, RSVP tracking, and notifications",
    author: "CampusGram Team",
    version: "1.2.0",
    category: "feature",
    tags: ["calendar", "events", "rsvp", "notifications"],
    rating: 4.8,
    downloads: 1250,
    price: "Free",
    icon: Calendar,
    features: ["Event creation", "RSVP management", "Email notifications", "Calendar sync"],
    screenshots: ["/image.png", "/image2.png"],
    isInstalled: false
  },
  {
    id: 2,
    name: "Study Group Finder",
    description: "Connect students with similar study goals and create study groups automatically",
    author: "StudyTech",
    version: "2.1.0",
    category: "feature",
    tags: ["study", "groups", "matching", "collaboration"],
    rating: 4.6,
    downloads: 890,
    price: "Free",
    icon: Users,
    features: ["Smart matching", "Group creation", "Study tracking", "Progress analytics"],
    screenshots: ["/image.png"],
    isInstalled: true
  },
  {
    id: 3,
    name: "Dark Mode Theme",
    description: "Beautiful dark theme with customizable colors and smooth transitions",
    author: "ThemeMaster",
    version: "1.0.5",
    category: "theme",
    tags: ["dark", "theme", "customization", "ui"],
    rating: 4.9,
    downloads: 2100,
    price: "Free",
    icon: Palette,
    features: ["Dark mode", "Custom colors", "Smooth transitions", "Accessibility"],
    screenshots: ["/image2.png"],
    isInstalled: false
  },
  {
    id: 4,
    name: "Campus Weather Widget",
    description: "Real-time weather information for your campus location with alerts",
    author: "WeatherPro",
    version: "1.3.2",
    category: "widget",
    tags: ["weather", "widget", "alerts", "location"],
    rating: 4.4,
    downloads: 650,
    price: "Free",
    icon: Globe,
    features: ["Real-time weather", "Campus alerts", "Location-based", "Notifications"],
    screenshots: ["/image.png"],
    isInstalled: false
  },
  {
    id: 5,
    name: "Code Snippet Manager",
    description: "Store and share code snippets with syntax highlighting and version control",
    author: "CodeCampus",
    version: "1.5.0",
    category: "feature",
    tags: ["code", "snippets", "sharing", "syntax"],
    rating: 4.7,
    downloads: 420,
    price: "Premium",
    icon: Code,
    features: ["Syntax highlighting", "Version control", "Sharing", "Search"],
    screenshots: ["/image2.png"],
    isInstalled: false
  },
  {
    id: 6,
    name: "Performance Booster",
    description: "Optimize your campus platform with advanced caching and performance monitoring",
    author: "SpeedTech",
    version: "2.0.1",
    category: "integration",
    tags: ["performance", "caching", "monitoring", "optimization"],
    rating: 4.5,
    downloads: 320,
    price: "Premium",
    icon: Zap,
    features: ["Advanced caching", "Performance monitoring", "Auto-optimization", "Analytics"],
    screenshots: ["/image.png"],
    isInstalled: false
  }
];

const categories = [
  { id: 'all', name: 'All Plugins', icon: Package },
  { id: 'feature', name: 'Features', icon: Zap },
  { id: 'theme', name: 'Themes', icon: Palette },
  { id: 'widget', name: 'Widgets', icon: Globe },
  { id: 'integration', name: 'Integrations', icon: Code }
];

export default function PluginMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlugin, setSelectedPlugin] = useState<typeof mockPlugins[0] | null>(null);

  const filteredPlugins = mockPlugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (plugin: typeof mockPlugins[0]) => {
    // Mock installation
    console.log(`Installing plugin: ${plugin.name}`);
    // In a real implementation, this would call the backend API
    alert(`Installing ${plugin.name}...`);
  };

  const handleUninstall = (plugin: typeof mockPlugins[0]) => {
    // Mock uninstallation
    console.log(`Uninstalling plugin: ${plugin.name}`);
    alert(`Uninstalling ${plugin.name}...`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plugin Marketplace</h1>
            <p className="text-gray-600">Discover and install plugins to extend your campus platform</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Plugin Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map(plugin => {
              const Icon = plugin.icon;
              return (
                <div
                  key={plugin.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  {/* Plugin Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon className="h-16 w-16 text-white" />
                  </div>

                  {/* Plugin Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{plugin.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        plugin.price === 'Free' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plugin.price}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plugin.description}</p>

                    {/* Rating and Downloads */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{plugin.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{plugin.downloads}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {plugin.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (plugin.isInstalled) {
                          handleUninstall(plugin);
                        } else {
                          handleInstall(plugin);
                        }
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        plugin.isInstalled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {plugin.isInstalled ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          Uninstall
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Install
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plugin Detail Modal */}
          {selectedPlugin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <selectedPlugin.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPlugin.name}</h2>
                        <p className="text-gray-600">by {selectedPlugin.author}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{selectedPlugin.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedPlugin.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPlugin(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedPlugin.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPlugin.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlugin.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (selectedPlugin.isInstalled) {
                          handleUninstall(selectedPlugin);
                        } else {
                          handleInstall(selectedPlugin);
                        }
                        setSelectedPlugin(null);
                      }}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        selectedPlugin.isInstalled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {selectedPlugin.isInstalled ? (
                        <>
                          <XCircle className="h-5 w-5" />
                          Uninstall Plugin
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          Install Plugin
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPlugin(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}