import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Font, Header, Body, Accent, Small } from "../components/Font";
import { useFonts } from "../hooks/useFonts";
import AdminTabs from "../components/AdminTabs";
import { 
  Settings, 
  Palette, 
  ToggleLeft, 
  ToggleRight, 
  Download, 
  Upload, 
  BarChart3, 
  Users, 
  FileText, 
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Zap,
  Globe,
  Database,
  Code,
  Image,
  Type,
  Layout,
  Bell,
  MessageSquare,
  Star,
  Heart,
  ThumbsUp,
  Search,
  Hash,
  Plus,
  Minus,
  Trash2,
  Edit,
  Copy,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Monitor,
  Package,
  Smartphone,
  Tablet
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

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fonts = useFonts();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Theme Configuration
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6", 
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderColor: "#d1d5db",
    primaryFont: "Patrick Hand",
    secondaryFont: "Gloria Hallelujah",
    borderRadius: 8,
    rotationIntensity: 2,
    crossHatchIntensity: 4
  });

  // Feature Toggles
  const [features, setFeatures] = useState<FeatureConfig>({
    posts: true,
    events: true,
    studyGroups: true,
    comments: true,
    likes: true,
    search: true,
    notifications: true,
    userProfiles: true,
    imageUpload: true,
    hashtags: true,
    locationSharing: true,
    adminPanel: true
  });

  // App Configuration
  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: "Campus Gram",
    universityName: "Your University",
    logo: "",
    description: "Connect with your campus community",
    maxFileSize: 10,
    maxPostsPerUser: 100,
    moderationEnabled: false,
    registrationOpen: true,
    maintenanceMode: false
  });

  // Analytics Data (mock)
  const [analytics] = useState({
    totalUsers: 1247,
    totalPosts: 8934,
    totalEvents: 156,
    totalStudyGroups: 89,
    activeUsers: 234,
    newUsersToday: 12,
    postsToday: 45,
    eventsToday: 3
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "themes", label: "Themes & Design", icon: Palette },
    { id: "features", label: "Features", icon: ToggleLeft },
    { id: "plugins", label: "Plugins", icon: Package },
    { id: "content", label: "Content", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "data", label: "Data & Export", icon: Database }
  ];

  const handleThemeChange = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleFeatureToggle = (feature: keyof FeatureConfig) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
    setHasUnsavedChanges(true);
  };

  const handleAppConfigChange = (key: keyof AppConfig, value: any) => {
    setAppConfig(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = () => {
    // In a real app, this would save to backend
    console.log("Saving changes:", { theme, features, appConfig });
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = () => {
    setTheme({
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      accentColor: "#f59e0b", 
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderColor: "#d1d5db",
      primaryFont: "Patrick Hand",
      secondaryFont: "Gloria Hallelujah",
      borderRadius: 8,
      rotationIntensity: 2,
      crossHatchIntensity: 4
    });
    setHasUnsavedChanges(true);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={fonts.primary}>
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <Header className="text-2xl text-red-600 mb-2">Access Denied</Header>
          <Body className="text-gray-600">You don't have admin privileges</Body>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={fonts.primary}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <Header className="text-2xl font-bold text-gray-900">Admin Panel</Header>
                <Small className="text-gray-500">{appConfig.appName} - {appConfig.universityName}</Small>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-4 py-2 rounded-lg border-2 flex items-center space-x-2 transition-colors ${
                  isPreviewMode 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isPreviewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>Preview Mode</span>
              </button>
              
              {hasUnsavedChanges && (
                <button
                  onClick={saveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              )}
              
              <button
                onClick={() => navigate('/feed')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <Header className="text-3xl font-bold text-gray-900 mb-2">Dashboard</Header>
                <Body className="text-gray-600">Overview of your campus community</Body>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Small className="text-gray-500">Total Users</Small>
                      <Header className="text-3xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</Header>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Small className="text-gray-500">Total Posts</Small>
                      <Header className="text-3xl font-bold text-gray-900">{analytics.totalPosts.toLocaleString()}</Header>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Small className="text-gray-500">Active Today</Small>
                      <Header className="text-3xl font-bold text-gray-900">{analytics.activeUsers}</Header>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Small className="text-gray-500">Events</Small>
                      <Header className="text-3xl font-bold text-gray-900">{analytics.totalEvents}</Header>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <Header className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Header>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <Small className="text-gray-700">Manage Users</Small>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <Small className="text-gray-700">Moderate Posts</Small>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <Small className="text-gray-700">Manage Events</Small>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <Small className="text-gray-700">App Settings</Small>
                  </button>
                </div>
              </div>
            </div>
          )}

          <AdminTabs
            activeTab={activeTab}
            theme={theme}
            features={features}
            appConfig={appConfig}
            handleThemeChange={handleThemeChange}
            handleFeatureToggle={handleFeatureToggle}
            handleAppConfigChange={handleAppConfigChange}
            saveChanges={saveChanges}
            resetToDefaults={resetToDefaults}
          />
        </div>
      </div>
    </div>
  );
}