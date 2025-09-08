import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  X,
  Mail,
  Lock,
  User
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
  enableCustomDomain: boolean;
  customDomain: string;
}

const COLOR_PRESETS = [
  { name: "Classic Blue", primary: "#1e40af", secondary: "#3b82f6", accent: "#60a5fa" },
  { name: "Forest Green", primary: "#166534", secondary: "#22c55e", accent: "#4ade80" },
  { name: "Royal Purple", primary: "#7c3aed", secondary: "#a855f7", accent: "#c084fc" },
  { name: "Crimson Red", primary: "#dc2626", secondary: "#ef4444", accent: "#f87171" },
  { name: "Sunset Orange", primary: "#ea580c", secondary: "#f97316", accent: "#fb923c" },
];

const FONT_OPTIONS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Poppins", 
  "Montserrat", "Source Sans Pro", "Nunito", "Raleway", "Ubuntu"
];

export default function UniversityOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [brandingData, setBrandingData] = useState<BrandingData>({
    // Basic Info
    name: "",
    domain: "",
    tagline: "",
    description: "",
    
    // Admin Account
    adminEmail: "",
    adminPassword: "",
    adminFullName: "",
    
    // Visual Branding
    logo: null,
    logoUrl: "",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    accentColor: "#60a5fa",
    
    // Typography
    fontFamily: "Inter",
    headingFont: "Inter",
    
    // Layout
    headerStyle: "minimal",
    theme: "light",
    enableCustomDomain: false,
    customDomain: "",
  });

  const steps = [
    { id: 1, title: "University Info", icon: Building2 },
    { id: 2, title: "Admin Account", icon: Shield },
    { id: 3, title: "Visual Branding", icon: Palette },
    { id: 4, title: "Typography", icon: Type },
    { id: 5, title: "Review & Launch", icon: Check },
  ];

  const handleInputChange = (field: keyof BrandingData, value: any) => {
    setBrandingData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleInputChange('logo', file);
      handleInputChange('logoUrl', url);
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
      const themeJson = {
        primaryColor: brandingData.primaryColor,
        secondaryColor: brandingData.secondaryColor,
        accentColor: brandingData.accentColor,
        fontFamily: brandingData.fontFamily,
        headingFont: brandingData.headingFont,
        headerStyle: brandingData.headerStyle,
        theme: brandingData.theme,
        logoUrl: brandingData.logoUrl,
      };

      await backend.university.create({
        name: brandingData.name,
        domain: brandingData.domain,
        adminEmail: brandingData.adminEmail,
        adminPassword: brandingData.adminPassword,
        adminFullName: brandingData.adminFullName,
        themeJson,
      });

      toast({
        title: "Success!",
        description: "University created successfully! You can now login with your admin account.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("University creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create university. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // University Information
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ transform: 'rotate(-0.5deg)' }}>University Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(0.5deg)' }}>University Name *</label>
                  <input
                    placeholder="e.g., Stanford University"
                    value={brandingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(-0.3deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.2deg)' }}>Domain *</label>
                  <input
                    placeholder="e.g., youruniversity.edu"
                    value={brandingData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(0.2deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1" style={{ transform: 'rotate(0.5deg)' }}>
                    Students will register with emails from this domain. Must be unique.
                  </p>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.1deg)' }}>Tagline</label>
                  <input
                    placeholder="e.g., Connecting campus life"
                    value={brandingData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(0.1deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(0.3deg)' }}>Description</label>
                  <textarea
                    placeholder="A brief description of your university"
                    value={brandingData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(-0.2deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Admin Account
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ transform: 'rotate(0.5deg)' }}>Admin Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.3deg)' }}>Your Full Name *</label>
                  <input
                    placeholder="e.g., Jane Doe"
                    value={brandingData.adminFullName}
                    onChange={(e) => handleInputChange('adminFullName', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(0.2deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(0.1deg)' }}>Admin Email *</label>
                  <input
                    type="email"
                    placeholder="e.g., admin@youruniversity.edu"
                    value={brandingData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(-0.1deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.2deg)' }}>Admin Password *</label>
                  <input
                    type="password"
                    placeholder="Enter a strong password"
                    value={brandingData.adminPassword}
                    onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                    className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(0.3deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Visual Branding
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ transform: 'rotate(-0.3deg)' }}>Visual Branding</h3>
              
              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-700 mb-3" style={{ transform: 'rotate(0.2deg)' }}>University Logo</label>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center bg-white"
                       style={{ 
                         transform: 'rotate(1deg)',
                         background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                       }}>
                    {brandingData.logoUrl ? (
                      <img src={brandingData.logoUrl} alt="Logo preview" className="w-full h-full object-contain rounded" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
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
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border-2 border-gray-600 rounded-lg text-lg font-bold text-gray-700 bg-white hover:bg-gray-50"
                      style={{ 
                        transform: 'rotate(-0.5deg)',
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-gray-700 mb-3" style={{ transform: 'rotate(0.1deg)' }}>Color Presets</label>
                <div className="grid grid-cols-1 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      className="p-3 border-2 border-gray-400 rounded-lg hover:border-gray-600 text-left"
                      style={{ 
                        transform: 'rotate(0.2deg)',
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                        </div>
                        <p className="text-base font-bold">{preset.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.1deg)' }}>Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-10 h-10 border-2 border-gray-600 rounded cursor-pointer"
                      style={{ transform: 'rotate(0.3deg)' }}
                    />
                    <input
                      value={brandingData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1 h-10 px-3 text-lg border-2 border-gray-600 rounded-lg bg-white"
                      style={{ 
                        transform: 'rotate(-0.2deg)',
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(0.2deg)' }}>Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-10 h-10 border-2 border-gray-600 rounded cursor-pointer"
                      style={{ transform: 'rotate(-0.1deg)' }}
                    />
                    <input
                      value={brandingData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 h-10 px-3 text-lg border-2 border-gray-600 rounded-lg bg-white"
                      style={{ 
                        transform: 'rotate(0.1deg)',
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.2deg)' }}>Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={brandingData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-10 h-10 border-2 border-gray-600 rounded cursor-pointer"
                      style={{ transform: 'rotate(0.2deg)' }}
                    />
                    <input
                      value={brandingData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1 h-10 px-3 text-lg border-2 border-gray-600 rounded-lg bg-white"
                      style={{ 
                        transform: 'rotate(-0.1deg)',
                        background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Typography
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ transform: 'rotate(0.3deg)' }}>Typography</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(-0.1deg)' }}>Body Font</label>
                  <select
                    value={brandingData.fontFamily}
                    onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                    className="w-full h-12 px-3 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(0.2deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2" style={{ transform: 'rotate(0.1deg)' }}>Heading Font</label>
                  <select
                    value={brandingData.headingFont}
                    onChange={(e) => handleInputChange('headingFont', e.target.value)}
                    className="w-full h-12 px-3 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                    style={{ 
                      transform: 'rotate(-0.2deg)',
                      background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                    }}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Review & Launch
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ transform: 'rotate(-0.2deg)' }}>Review & Launch</h3>
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-400 rounded-lg" style={{ 
                  transform: 'rotate(0.1deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}>
                  <h4 className="font-bold mb-2 text-lg">University Details</h4>
                  <p><strong>Name:</strong> {brandingData.name}</p>
                  <p><strong>Domain:</strong> {brandingData.domain}</p>
                  <p><strong>Tagline:</strong> {brandingData.tagline || 'Not set'}</p>
                  <p><strong>Description:</strong> {brandingData.description || 'Not set'}</p>
                </div>
                <div className="p-4 border-2 border-gray-400 rounded-lg" style={{ 
                  transform: 'rotate(-0.1deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}>
                  <h4 className="font-bold mb-2 text-lg">Admin Account</h4>
                  <p><strong>Full Name:</strong> {brandingData.adminFullName}</p>
                  <p><strong>Email:</strong> {brandingData.adminEmail}</p>
                </div>
                <div className="p-4 border-2 border-gray-400 rounded-lg" style={{ 
                  transform: 'rotate(0.2deg)',
                  background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
                }}>
                  <h4 className="font-bold mb-2 text-lg">Branding</h4>
                  <p><strong>Primary Color:</strong> <span style={{ color: brandingData.primaryColor }}>{brandingData.primaryColor}</span></p>
                  <p><strong>Secondary Color:</strong> <span style={{ color: brandingData.secondaryColor }}>{brandingData.secondaryColor}</span></p>
                  <p><strong>Accent Color:</strong> <span style={{ color: brandingData.accentColor }}>{brandingData.accentColor}</span></p>
                  <p><strong>Body Font:</strong> <span style={{ fontFamily: brandingData.fontFamily }}>{brandingData.fontFamily}</span></p>
                  <p><strong>Heading Font:</strong> <span style={{ fontFamily: brandingData.headingFont }}>{brandingData.headingFont}</span></p>
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
    <div className="min-h-screen bg-gray-50 font-primary">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-gray-600" style={{ transform: 'rotate(5deg)' }} />
              <div>
                <h1 className="text-xl font-bold text-gray-900" style={{ transform: 'rotate(-0.5deg)' }}>University Setup</h1>
                <p className="text-sm text-gray-600" style={{ transform: 'rotate(0.3deg)' }}>Step {currentStep} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 hover:text-gray-800"
              style={{ transform: 'rotate(-2deg)' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-800"
                   style={{ transform: 'rotate(2deg)' }}>
                {(() => {
                  const CurrentIcon = steps[currentStep - 1].icon;
                  return <CurrentIcon className="h-6 w-6" />;
                })()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900" style={{ transform: 'rotate(-0.5deg)' }}>
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-sm text-gray-600" style={{ transform: 'rotate(0.3deg)' }}>
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3" style={{ transform: 'rotate(-0.2deg)' }}>
            <div 
              className="bg-gray-600 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentStep / steps.length) * 100}%`,
                background: 'repeating-linear-gradient(45deg, #4b5563, #4b5563 2px, #6b7280 2px, #6b7280 4px)'
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8 p-6 border-2 border-gray-400 rounded-lg" style={{ 
          transform: 'rotate(0.1deg)',
          background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
        }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex-1 h-12 text-gray-700 font-bold text-lg rounded-lg border-2 border-gray-600 hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              transform: 'rotate(-0.5deg)',
              background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
            }}
          >
            <ArrowLeft className="h-5 w-5 inline mr-2" />
            Previous
          </button>
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!brandingData.name || !brandingData.domain)) ||
                (currentStep === 2 && (!brandingData.adminEmail || !brandingData.adminPassword || !brandingData.adminFullName))
              }
              className="flex-1 h-12 text-gray-800 font-bold text-lg rounded-lg border-2 border-gray-600 hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                transform: 'rotate(0.3deg)',
                background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
              }}
            >
              Next
              <ArrowRight className="h-5 w-5 inline ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-12 text-white font-bold text-lg rounded-lg border-2 border-gray-800 hover:border-gray-900 disabled:opacity-50"
              style={{ 
                transform: 'rotate(-0.2deg)',
                background: 'repeating-linear-gradient(45deg, #1f2937, #1f2937 2px, #374151 2px, #374151 4px)',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.3)'
              }}
            >
              {loading ? "Creating..." : "Create University"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}