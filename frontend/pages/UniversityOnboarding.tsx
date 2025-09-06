import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Palette, 
  Type, 
  Image, 
  Globe, 
  Shield,
  Check,
  Eye,
  Upload,
  X
} from "lucide-react";
import backend from "~backend/client";

interface BrandingData {
  // Basic Info
  name: string;
  domain: string;
  tagline: string;
  description: string;
  
  // Admin Account
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
  
  // Visual Branding
  logo: File | null;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Typography
  fontFamily: string;
  headingFont: string;
  
  // Layout
  headerStyle: 'minimal' | 'detailed' | 'custom';
  theme: 'light' | 'dark' | 'auto';
  
  // Custom Domain
  customDomain: string;
  enableCustomDomain: boolean;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', category: 'Modern' },
  { value: 'Poppins', label: 'Poppins', category: 'Friendly' },
  { value: 'Roboto', label: 'Roboto', category: 'Clean' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Readable' },
  { value: 'Lato', label: 'Lato', category: 'Elegant' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Bold' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Professional' },
  { value: 'Nunito', label: 'Nunito', category: 'Rounded' },
];

const COLOR_PRESETS = [
  { name: 'Classic Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#f59e0b' },
  { name: 'Forest Green', primary: '#059669', secondary: '#10b981', accent: '#f59e0b' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#f59e0b' },
  { name: 'Crimson Red', primary: '#dc2626', secondary: '#ef4444', accent: '#f59e0b' },
  { name: 'Ocean Teal', primary: '#0d9488', secondary: '#14b8a6', accent: '#f59e0b' },
  { name: 'Sunset Orange', primary: '#ea580c', secondary: '#f97316', accent: '#1e40af' },
];

export default function UniversityOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [brandingData, setBrandingData] = useState<BrandingData>({
    name: '',
    domain: '',
    tagline: '',
    description: '',
    adminEmail: '',
    adminPassword: '',
    adminFullName: '',
    logo: null,
    logoUrl: '',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    headerStyle: 'minimal',
    theme: 'light',
    customDomain: '',
    enableCustomDomain: false,
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Admin Account', icon: Shield },
    { id: 3, title: 'Visual Branding', icon: Palette },
    { id: 4, title: 'Typography', icon: Type },
    { id: 5, title: 'Layout & Theme', icon: Globe },
    { id: 6, title: 'Review & Launch', icon: Check },
  ];

  const handleInputChange = (field: keyof BrandingData, value: any) => {
    setBrandingData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logo', file);
        handleInputChange('logoUrl', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    handleInputChange('primaryColor', preset.primary);
    handleInputChange('secondaryColor', preset.secondary);
    handleInputChange('accentColor', preset.accent);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare the branding data for the API
      const themeJson = {
        colors: {
          primary: brandingData.primaryColor,
          secondary: brandingData.secondaryColor,
          accent: brandingData.accentColor,
        },
        typography: {
          fontFamily: brandingData.fontFamily,
          headingFont: brandingData.headingFont,
        },
        layout: {
          headerStyle: brandingData.headerStyle,
          theme: brandingData.theme,
        },
        branding: {
          tagline: brandingData.tagline,
          description: brandingData.description,
          logoUrl: brandingData.logoUrl,
        },
        customDomain: brandingData.enableCustomDomain ? brandingData.customDomain : null,
      };

      const university = await backend.university.create({
        name: brandingData.name,
        domain: brandingData.domain,
        adminEmail: brandingData.adminEmail,
        adminPassword: brandingData.adminPassword,
        adminFullName: brandingData.adminFullName,
        themeJson: themeJson,
      });

      toast({
        title: "University Created!",
        description: `Welcome to ${university.name}! Your campus social network is ready.`,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to create university:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create university",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">University Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University Name *
                  </label>
                  <Input
                    placeholder="e.g., Stanford University"
                    value={brandingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain *
                  </label>
                  <Input
                    placeholder="e.g., youruniversity.edu"
                    value={brandingData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Students will register with emails from this domain. Must be unique.
                  </p>
                  {brandingData.domain === 'stanford.edu' || brandingData.domain === 'berkeley.edu' ? (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ This domain is already in use. Please choose a different domain.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <Input
                    placeholder="e.g., The wind of freedom blows"
                    value={brandingData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="Brief description of your university..."
                    value={brandingData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Admin Account</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name *
                  </label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={brandingData.adminFullName}
                    onChange={(e) => handleInputChange('adminFullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g., admin@stanford.edu"
                    value={brandingData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Password *
                  </label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={brandingData.adminPassword}
                    onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Visual Branding</h3>
              
              {/* Logo Upload - Mobile Optimized */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Logo
                </label>
                <div className="flex flex-col space-y-3">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    {brandingData.logoUrl ? (
                      <img src={brandingData.logoUrl} alt="Logo preview" className="w-full h-full object-contain rounded" />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                    {brandingData.logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleInputChange('logo', null);
                          handleInputChange('logoUrl', '');
                        }}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Logo
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  PNG, JPG, or SVG. Max 5MB. Recommended: 200x200px
                </p>
              </div>

              {/* Color Presets - Mobile Grid */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color Presets
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      className="p-3 border rounded-lg hover:border-gray-400 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                        </div>
                        <p className="text-sm font-medium">{preset.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors - Mobile Stack */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Typography</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font
                  </label>
                  <select
                    value={brandingData.fontFamily}
                    onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font
                  </label>
                  <select
                    value={brandingData.headingFont}
                    onChange={(e) => handleInputChange('headingFont', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  <div style={{ fontFamily: brandingData.fontFamily }}>
                    <h1 style={{ fontFamily: brandingData.headingFont }} className="text-2xl font-bold mb-2">
                      Sample Heading
                    </h1>
                    <p className="text-gray-600">
                      This is how your body text will look with the selected font. It should be easy to read and professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Layout & Theme</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Header Style
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'minimal', label: 'Minimal', desc: 'Clean and simple' },
                      { value: 'detailed', label: 'Detailed', desc: 'More information' },
                      { value: 'custom', label: 'Custom', desc: 'Fully customizable' },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => handleInputChange('headerStyle', style.value)}
                        className={`w-full p-3 border rounded-lg text-left ${
                          brandingData.headerStyle === style.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium text-sm">{style.label}</div>
                        <div className="text-xs text-gray-500">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'light', label: 'Light', desc: 'Clean and bright' },
                      { value: 'dark', label: 'Dark', desc: 'Easy on the eyes' },
                      { value: 'auto', label: 'Auto', desc: 'Follows system' },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleInputChange('theme', theme.value)}
                        className={`w-full p-3 border rounded-lg text-left ${
                          brandingData.theme === theme.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium text-sm">{theme.label}</div>
                        <div className="text-xs text-gray-500">{theme.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain (Optional)
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={brandingData.enableCustomDomain}
                        onChange={(e) => handleInputChange('enableCustomDomain', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Enable custom domain</span>
                    </div>
                    <Input
                      placeholder="e.g., connect.stanford.edu"
                      value={brandingData.customDomain}
                      onChange={(e) => handleInputChange('customDomain', e.target.value)}
                      disabled={!brandingData.enableCustomDomain}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires DNS configuration. Contact support for setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Review & Launch</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">University Details</h4>
                  <p><strong>Name:</strong> {brandingData.name}</p>
                  <p><strong>Domain:</strong> {brandingData.domain}</p>
                  <p><strong>Tagline:</strong> {brandingData.tagline || 'Not set'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Admin Account</h4>
                  <p><strong>Name:</strong> {brandingData.adminFullName}</p>
                  <p><strong>Email:</strong> {brandingData.adminEmail}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Branding</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingData.primaryColor }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingData.secondaryColor }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandingData.accentColor }}></div>
                    <span className="text-sm text-gray-600">Color scheme</span>
                  </div>
                  <p><strong>Fonts:</strong> {brandingData.fontFamily} / {brandingData.headingFont}</p>
                  <p><strong>Theme:</strong> {brandingData.theme}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your university will be created with the admin account</li>
                    <li>• Students can start registering with @{brandingData.domain} emails</li>
                    <li>• You'll have full admin access to manage the platform</li>
                    <li>• Custom branding will be applied across the platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">University Setup</h1>
                <p className="text-xs text-gray-600">Step {currentStep} of {steps.length}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Mobile Progress - Current Step Only */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
                {(() => {
                  const CurrentIcon = steps[currentStep - 1].icon;
                  return <CurrentIcon className="h-5 w-5" />;
                })()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
          </div>
          {/* Simple Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Mobile Preview - Collapsible */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Live Preview
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-gray-500"
              >
                {previewMode ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {previewMode && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* University Card Preview */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: brandingData.primaryColor + '10',
                    borderColor: brandingData.primaryColor + '30',
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {brandingData.logoUrl && (
                      <img src={brandingData.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-sm truncate"
                        style={{ 
                          fontFamily: brandingData.headingFont,
                          color: brandingData.primaryColor 
                        }}
                      >
                        {brandingData.name || 'Your University'}
                      </h3>
                      {brandingData.tagline && (
                        <p 
                          className="text-xs truncate"
                          style={{ color: brandingData.secondaryColor }}
                        >
                          {brandingData.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-xs leading-relaxed"
                    style={{ 
                      fontFamily: brandingData.fontFamily,
                      color: '#374151'
                    }}
                  >
                    {brandingData.description || 'Your university description will appear here...'}
                  </div>
                </div>

                {/* Sample Post Preview */}
                <div 
                  className="p-3 rounded-lg border bg-white"
                  style={{ borderColor: brandingData.primaryColor + '20' }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: brandingData.primaryColor }}
                    >
                      U
                    </div>
                    <div>
                      <p 
                        className="text-xs font-medium"
                        style={{ 
                          fontFamily: brandingData.headingFont,
                          color: brandingData.primaryColor 
                        }}
                      >
                        Student Name
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: brandingData.secondaryColor }}
                      >
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <p 
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: brandingData.fontFamily }}
                  >
                    This is how a sample post will look with your chosen typography and colors.
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <button 
                      className="flex items-center space-x-1 text-xs"
                      style={{ color: brandingData.accentColor }}
                    >
                      <span>❤️</span>
                      <span>12</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 text-xs"
                      style={{ color: brandingData.secondaryColor }}
                    >
                      <span>💬</span>
                      <span>3</span>
                    </button>
                  </div>
                </div>

                {/* Color & Font Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandingData.primaryColor }}></div>
                    <span>Primary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandingData.secondaryColor }}></div>
                    <span>Secondary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandingData.accentColor }}></div>
                    <span>Accent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="truncate" style={{ fontFamily: brandingData.fontFamily }}>{brandingData.fontFamily}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Mobile Navigation - Sticky Bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 -mb-6 mt-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1 h-12"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!brandingData.name || !brandingData.domain || brandingData.domain === 'stanford.edu' || brandingData.domain === 'berkeley.edu')) ||
                  (currentStep === 2 && (!brandingData.adminEmail || !brandingData.adminPassword || !brandingData.adminFullName))
                }
                className="flex-1 h-12"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              >
                {loading ? "Creating..." : "Create University"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
