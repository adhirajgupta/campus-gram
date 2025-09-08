# CampusGram MCP (Model Context Protocol) Client Guide

## 🎯 Overview

The CampusGram MCP Client is a powerful plugin system that allows universities to easily add new features, customize themes, and integrate with external services. It's built on the Model Context Protocol to provide a secure, extensible platform for campus-specific enhancements.

## 🏗️ Architecture

### Core Components

1. **MCP Backend Service** (`backend/mcp/`)
   - Plugin registry and management
   - Dynamic API endpoint registration
   - Database schema extensions
   - Security sandboxing

2. **MCP Frontend Client** (`frontend/pages/PluginMarketplace.tsx`)
   - Plugin marketplace interface
   - Dynamic component loading
   - Plugin configuration UI

3. **Plugin Development Kit** (`frontend/lib/plugin-loader.ts`)
   - TypeScript templates
   - API hooks and utilities
   - Component library
   - Testing framework

## 🚀 Getting Started

### 1. Setup MCP System

First, run the database migrations to create the plugin tables:

```bash
cd backend
encore run
```

Then seed the plugin templates:

```bash
curl -X POST http://localhost:4000/mcp/seed-templates
```

### 2. Access Plugin Marketplace

Navigate to the Plugin Marketplace in your CampusGram instance:
- URL: `http://localhost:5173/plugin-marketplace`
- Or add it to your navigation menu

### 3. Install Your First Plugin

1. Browse available plugins in the marketplace
2. Click "Install" on a plugin you want
3. Configure the plugin settings
4. Activate the plugin

## 🔌 Plugin Types

### 1. **Feature Plugins**
Add new functionality to your campus platform:
- Study group schedulers
- Advanced search filters
- Custom notification systems
- Integration with external services

### 2. **Theme Plugins**
Customize the visual appearance:
- Dark mode themes
- University-specific color schemes
- Custom fonts and typography
- Seasonal themes

### 3. **Widget Plugins**
Add small components to existing pages:
- Weather widgets
- Campus news feeds
- Quick access tools
- Social media integrations

### 4. **Integration Plugins**
Connect with external services:
- Discord server integration
- Google Calendar sync
- Slack notifications
- Learning management systems

## 🛠️ Creating Custom Plugins

### Plugin Structure

```typescript
interface PluginTemplate {
  name: string;
  version: string;
  description: string;
  author: string;
  pluginType: 'feature' | 'theme' | 'integration' | 'widget';
  category: string;
  tags: string[];
  codeTemplate: {
    frontend: {
      component: string; // React component code
      route?: string;    // Route path for page components
      componentType: 'page' | 'widget' | 'modal' | 'sidebar' | 'navbar';
    };
    backend: {
      endpoints: Array<{
        path: string;
        method: string;
        handler: string; // API handler code
      }>;
    };
  };
  configSchema: object; // JSON schema for configuration
  permissions: string[]; // Required permissions
  dependencies: string[]; // Plugin dependencies
}
```

### Example: Weather Widget Plugin

```typescript
const weatherPlugin = {
  name: "Campus Weather Widget",
  version: "1.0.0",
  description: "Display current weather for your campus",
  author: "Your University",
  pluginType: "widget",
  category: "utilities",
  tags: ["weather", "widget", "campus"],
  codeTemplate: {
    frontend: {
      component: `
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeatherWidget({ config }) {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    fetch(\`/api/weather?location=\${config.campusLocation}\`)
      .then(res => res.json())
      .then(setWeather);
  }, [config.campusLocation]);
  
  return (
    <Card className="border-2 border-gray-400">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        {weather ? (
          <div>
            <div className="text-2xl font-bold">{weather.temperature}°F</div>
            <div className="text-gray-600">{weather.condition}</div>
          </div>
        ) : (
          <div>Loading weather...</div>
        )}
      </CardContent>
    </Card>
  );
}`,
      componentType: "widget"
    },
    backend: {
      endpoints: [{
        path: "/weather",
        method: "GET",
        handler: `
export const getWeather = api<{ location: string }, { temperature: number; condition: string }>(
  { expose: true, method: "GET", path: "/weather" },
  async (req) => {
    // Your weather API logic here
    return {
      temperature: 72,
      condition: "Sunny"
    };
  }
);`
      }]
    }
  },
  configSchema: {
    type: "object",
    properties: {
      campusLocation: {
        type: "string",
        title: "Campus Location",
        description: "City and state for weather data"
      }
    },
    required: ["campusLocation"]
  },
  permissions: ["read:weather"],
  dependencies: []
};
```

## 🔒 Security & Sandboxing

### Plugin Security Features

1. **Code Sanitization**: All plugin code is sanitized to remove dangerous patterns
2. **API Restrictions**: Plugins can only access approved API endpoints
3. **Permission System**: Plugins declare required permissions
4. **Sandboxed Execution**: Plugin code runs in a controlled environment
5. **University Isolation**: Plugins are scoped to individual universities

### Safe API Access

Plugins can only access:
- `/api/plugin/*` endpoints
- University-scoped data
- Approved external APIs
- Plugin-specific data storage

## 📊 Plugin Management

### Admin Functions

1. **Install/Uninstall**: Add or remove plugins
2. **Enable/Disable**: Toggle plugin activation
3. **Configure**: Set plugin-specific settings
4. **Monitor**: View plugin performance and errors
5. **Update**: Upgrade plugin versions

### Plugin Lifecycle

1. **Installation**: Plugin code is stored and validated
2. **Configuration**: Admin sets up plugin parameters
3. **Activation**: Plugin components are loaded
4. **Runtime**: Plugin executes with sandboxed access
5. **Deactivation**: Plugin is safely disabled
6. **Uninstallation**: Plugin is completely removed

## 🎨 Customization Examples

### University-Specific Themes

```typescript
const universityTheme = {
  name: "Stanford Cardinal Theme",
  pluginType: "theme",
  codeTemplate: {
    frontend: {
      component: `
export const stanfordTheme = {
  colors: {
    primary: "#8C1515", // Stanford Cardinal
    secondary: "#2E2D29", // Stanford Dark
    accent: "#009639", // Stanford Green
    background: "#F4F4F4"
  },
  fonts: {
    primary: "Source Serif Pro, serif",
    secondary: "Source Sans Pro, sans-serif"
  }
};`
    }
  }
};
```

### Study Group Integration

```typescript
const studyGroupPlugin = {
  name: "Advanced Study Groups",
  pluginType: "feature",
  codeTemplate: {
    frontend: {
      component: `
export default function AdvancedStudyGroups() {
  return (
    <div>
      <h2>Advanced Study Groups</h2>
      <StudyGroupScheduler />
      <StudyGroupAnalytics />
      <StudyGroupRecommendations />
    </div>
  );
}`
    }
  },
  dependencies: ["studygroups"]
};
```

## 🔧 Development Tools

### Plugin Development Kit

1. **Template Generator**: Create plugin boilerplate
2. **Local Testing**: Test plugins in development
3. **Code Validation**: Validate plugin code before deployment
4. **Documentation Generator**: Auto-generate plugin docs

### Testing Plugins

```bash
# Test plugin locally
npm run test:plugin -- --plugin=weather-widget

# Validate plugin code
npm run validate:plugin -- --path=./plugins/weather-widget

# Build plugin for production
npm run build:plugin -- --plugin=weather-widget
```

## 📈 Best Practices

### Plugin Development

1. **Keep it Simple**: Start with basic functionality
2. **Follow Conventions**: Use established patterns
3. **Handle Errors**: Implement proper error handling
4. **Document Everything**: Provide clear documentation
5. **Test Thoroughly**: Test in various scenarios

### Performance

1. **Lazy Loading**: Load plugin components on demand
2. **Caching**: Cache plugin data appropriately
3. **Minimal Dependencies**: Reduce external dependencies
4. **Efficient APIs**: Optimize API calls

### Security

1. **Validate Input**: Always validate user input
2. **Limit Permissions**: Request only necessary permissions
3. **Secure Storage**: Use plugin data storage safely
4. **Regular Updates**: Keep plugins updated

## 🚀 Deployment

### Publishing Plugins

1. **Create Plugin**: Develop your plugin
2. **Test Thoroughly**: Test in development environment
3. **Submit for Review**: Submit to plugin marketplace
4. **Deploy**: Plugin becomes available to universities

### University Deployment

1. **Browse Marketplace**: Find suitable plugins
2. **Install**: Install plugins for your university
3. **Configure**: Set up plugin settings
4. **Activate**: Enable plugins for users

## 📚 API Reference

### Plugin API Endpoints

- `GET /mcp/templates` - List available plugin templates
- `POST /mcp/install` - Install a plugin template
- `GET /mcp/plugins` - List installed plugins
- `PUT /mcp/plugins/:id` - Update plugin configuration
- `DELETE /mcp/plugins/:id` - Uninstall a plugin
- `GET /mcp/components` - Get plugin components
- `GET /mcp/endpoints` - Get plugin API endpoints

### Plugin Context API

```typescript
// Access plugin context in components
const { config, data, updateData } = usePluginContext();

// Update plugin data
updateData('userPreferences', { theme: 'dark' });

// Access plugin configuration
const campusLocation = config.campusLocation;
```

## 🤝 Contributing

### Adding New Plugin Templates

1. Fork the repository
2. Create your plugin template
3. Add it to the seed templates
4. Submit a pull request

### Reporting Issues

1. Check existing issues
2. Create detailed bug reports
3. Include reproduction steps
4. Provide system information

## 📞 Support

- **Documentation**: This guide and inline code comments
- **Community**: GitHub discussions and issues
- **Email**: support@campusgram.dev
- **Discord**: Join our developer community

---

**Happy Plugin Development! 🎉**

The CampusGram MCP system empowers universities to create truly customized campus experiences. Start with simple widgets and gradually build more complex features that make your campus platform unique.
