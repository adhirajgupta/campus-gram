import { useState } from "react";
import { Font, Header, Body, Accent, Small } from "./Font";
import { 
  Users, 
  FileText, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Settings,
  Package,
  ExternalLink,
  MessageSquare
} from "lucide-react";

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  primaryFont: string;
  secondaryFont: string;
  borderRadius: number;
  rotationIntensity: number;
  crossHatchIntensity: number;
}

interface FeatureConfig {
  posts: boolean;
  events: boolean;
  studyGroups: boolean;
  comments: boolean;
  likes: boolean;
  search: boolean;
  notifications: boolean;
  userProfiles: boolean;
  imageUpload: boolean;
  hashtags: boolean;
  locationSharing: boolean;
  adminPanel: boolean;
}

interface AppConfig {
  appName: string;
  universityName: string;
  logo: string;
  description: string;
  maxFileSize: number;
  maxPostsPerUser: number;
  moderationEnabled: boolean;
  registrationOpen: boolean;
  maintenanceMode: boolean;
}

interface AdminTabsProps {
  activeTab: string;
  theme: ThemeConfig;
  features: FeatureConfig;
  appConfig: AppConfig;
  handleThemeChange: (key: keyof ThemeConfig, value: any) => void;
  handleFeatureToggle: (feature: keyof FeatureConfig) => void;
  handleAppConfigChange: (key: keyof AppConfig, value: any) => void;
  saveChanges: () => void;
  resetToDefaults: () => void;
}

export default function AdminTabs({ 
  activeTab, 
  theme, 
  features, 
  appConfig, 
  handleThemeChange, 
  handleFeatureToggle, 
  handleAppConfigChange, 
  saveChanges, 
  resetToDefaults 
}: AdminTabsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Mock data
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@university.edu", role: "student", status: "active", posts: 23, joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@university.edu", role: "student", status: "active", posts: 45, joined: "2024-01-10" },
    { id: 3, name: "Dr. Johnson", email: "johnson@university.edu", role: "faculty", status: "active", posts: 12, joined: "2024-01-05" },
    { id: 4, name: "Mike Wilson", email: "mike@university.edu", role: "student", status: "banned", posts: 0, joined: "2024-01-20" },
  ];

  const mockPosts = [
    { id: 1, title: "Study Group for CS 101", author: "John Doe", content: "Looking for study partners...", status: "published", likes: 15, comments: 8, created: "2024-01-25" },
    { id: 2, title: "Campus Event Tomorrow", author: "Jane Smith", content: "Don't miss the career fair...", status: "published", likes: 32, comments: 12, created: "2024-01-24" },
    { id: 3, title: "Inappropriate Content", author: "Mike Wilson", content: "This post was flagged...", status: "flagged", likes: 0, comments: 0, created: "2024-01-23" },
  ];

  const mockEvents = [
    { id: 1, title: "Career Fair 2024", date: "2024-02-15", location: "Student Center", attendees: 150, status: "active" },
    { id: 2, title: "Study Group Meeting", date: "2024-02-10", location: "Library", attendees: 8, status: "active" },
    { id: 3, title: "Cancelled Event", date: "2024-02-05", location: "Auditorium", attendees: 0, status: "cancelled" },
  ];

  if (activeTab === "themes") {
    return (
      <div className="space-y-6">
        <div>
          <Header className="text-3xl font-bold text-gray-900 mb-2">Themes & Design</Header>
          <Body className="text-gray-600">Customize the look and feel of your campus app</Body>
        </div>

        {/* Color Palette */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Color Palette</Header>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => handleThemeChange('textColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.textColor}
                  onChange={(e) => handleThemeChange('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={theme.borderColor}
                  onChange={(e) => handleThemeChange('borderColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.borderColor}
                  onChange={(e) => handleThemeChange('borderColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Typography</Header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font</label>
              <select
                value={theme.primaryFont}
                onChange={(e) => handleThemeChange('primaryFont', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Patrick Hand">Patrick Hand</option>
                <option value="Gloria Hallelujah">Gloria Hallelujah</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Font</label>
              <select
                value={theme.secondaryFont}
                onChange={(e) => handleThemeChange('secondaryFont', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Gloria Hallelujah">Gloria Hallelujah</option>
                <option value="Patrick Hand">Patrick Hand</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Effects */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Visual Effects</Header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius: {theme.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={theme.borderRadius}
                onChange={(e) => handleThemeChange('borderRadius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation Intensity: {theme.rotationIntensity}°
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={theme.rotationIntensity}
                onChange={(e) => handleThemeChange('rotationIntensity', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cross-hatch Intensity: {theme.crossHatchIntensity}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={theme.crossHatchIntensity}
                onChange={(e) => handleThemeChange('crossHatchIntensity', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Live Preview</Header>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div 
              className="inline-block p-6 rounded-lg border-2"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderColor: theme.borderColor,
                borderRadius: `${theme.borderRadius}px`,
                transform: `rotate(${theme.rotationIntensity * 0.1}deg)`,
                background: `repeating-linear-gradient(45deg, ${theme.backgroundColor}, ${theme.backgroundColor} 2px, ${theme.borderColor} 2px, ${theme.borderColor} ${theme.crossHatchIntensity}px)`,
                fontFamily: theme.primaryFont
              }}
            >
              <Header className="text-2xl font-bold mb-2" style={{ color: theme.primaryColor, fontFamily: theme.secondaryFont }}>
                {appConfig.appName}
              </Header>
              <Body className="text-lg" style={{ color: theme.textColor }}>
                Welcome to {appConfig.universityName}!
              </Body>
              <button 
                className="mt-4 px-4 py-2 rounded-lg text-white font-bold"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  borderRadius: `${theme.borderRadius}px`,
                  transform: `rotate(${theme.rotationIntensity * -0.1}deg)`
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={resetToDefaults}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={saveChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Save Theme</span>
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === "users") {
    return (
      <div className="space-y-6">
        <div>
          <Header className="text-3xl font-bold text-gray-900 mb-2">User Management</Header>
          <Body className="text-gray-600">Manage users, roles, and permissions</Body>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <Header className="text-sm font-medium text-gray-900">{user.name}</Header>
                        <Small className="text-sm text-gray-500">{user.email}</Small>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'faculty' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.posts}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "content") {
    return (
      <div className="space-y-6">
        <div>
          <Header className="text-3xl font-bold text-gray-900 mb-2">Content Management</Header>
          <Body className="text-gray-600">Moderate posts, events, and user-generated content</Body>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Total Posts</Small>
                <Header className="text-2xl font-bold text-gray-900">1,234</Header>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Flagged Content</Small>
                <Header className="text-2xl font-bold text-gray-900">23</Header>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Pending Review</Small>
                <Header className="text-2xl font-bold text-gray-900">8</Header>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Posts Management */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <Header className="text-xl font-bold text-gray-900">Posts</Header>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Header className="text-sm font-medium text-gray-900">{post.title}</Header>
                        <Small className="text-sm text-gray-500 line-clamp-2">{post.content}</Small>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'flagged' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.created}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-900">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "plugins") {
    return (
      <div className="space-y-6">
        <div>
          <Header className="text-3xl font-bold text-gray-900 mb-2">Plugin Management</Header>
          <Body className="text-gray-600">Install, configure, and manage plugins for your campus platform</Body>
        </div>

        {/* Plugin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Installed Plugins</Small>
                <Header className="text-2xl font-bold text-gray-900">4</Header>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Active Plugins</Small>
                <Header className="text-2xl font-bold text-gray-900">3</Header>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Small className="text-gray-500">Available Plugins</Small>
                <Header className="text-2xl font-bold text-gray-900">12</Header>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/plugin-marketplace'}
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-3"
            >
              <Package className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <Header className="text-lg font-semibold text-gray-900">Browse Marketplace</Header>
                <Small className="text-gray-600">Discover and install new plugins</Small>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </button>
            
            <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-3">
              <Plus className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <Header className="text-lg font-semibold text-gray-900">Create Custom Plugin</Header>
                <Small className="text-gray-600">Build a plugin for your specific needs</Small>
              </div>
            </button>
          </div>
        </div>

        {/* Installed Plugins */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <Header className="text-xl font-bold text-gray-900">Installed Plugins</Header>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Weather Widget Plugin */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Header className="text-lg font-semibold text-gray-900">Weather Widget</Header>
                    <Small className="text-gray-600">Display campus weather conditions</Small>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Active
                  </span>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Study Group Scheduler Plugin */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <Header className="text-lg font-semibold text-gray-900">Study Group Scheduler</Header>
                    <Small className="text-gray-600">Advanced scheduling for study groups</Small>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Active
                  </span>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dark Mode Theme Plugin */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <Header className="text-lg font-semibold text-gray-900">Dark Mode Theme</Header>
                    <Small className="text-gray-600">Beautiful dark mode for your campus</Small>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Inactive
                  </span>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Discord Integration Plugin */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <Header className="text-lg font-semibold text-gray-900">Discord Integration</Header>
                    <Small className="text-gray-600">Connect your Discord server</Small>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Active
                  </span>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plugin Development */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Header className="text-xl font-bold text-gray-900 mb-4">Plugin Development</Header>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Header className="text-lg font-semibold text-gray-900 mb-2">Getting Started</Header>
              <Body className="text-gray-600 mb-3">
                Create custom plugins to extend your campus platform with features specific to your university's needs.
              </Body>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Documentation
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Download SDK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
