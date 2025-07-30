// Frontend Configuration Management
const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://backend-production-219d.up.railway.app/api',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Voting System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Secure Online Voting System'
  },

  // Environment
  env: {
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
    appEnv: import.meta.env.VITE_APP_ENV || 'development',
    isProduction: import.meta.env.VITE_NODE_ENV === 'production',
    isDevelopment: import.meta.env.VITE_NODE_ENV === 'development'
  },

  // Authentication Configuration
  auth: {
    jwtStorageKey: import.meta.env.VITE_JWT_STORAGE_KEY || 'voting_system_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'voting_system_refresh_token',
    tokenExpiryCheckInterval: parseInt(import.meta.env.VITE_TOKEN_EXPIRY_CHECK_INTERVAL) || 60000
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
    allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif'],
    endpoint: import.meta.env.VITE_UPLOAD_ENDPOINT || '/api/upload'
  },

  // UI Configuration
  ui: {
    theme: import.meta.env.VITE_THEME || 'light',
    language: import.meta.env.VITE_LANGUAGE || 'en',
    timezone: import.meta.env.VITE_TIMEZONE || 'UTC',
    dateFormat: import.meta.env.VITE_DATE_FORMAT || 'YYYY-MM-DD',
    timeFormat: import.meta.env.VITE_TIME_FORMAT || 'HH:mm:ss'
  },

  // Feature Flags
  features: {
    enableRegistration: import.meta.env.VITE_ENABLE_REGISTRATION === 'true',
    enablePasswordReset: import.meta.env.VITE_ENABLE_PASSWORD_RESET === 'true',
    enableFileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD === 'true',
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  },

  // Analytics Configuration
  analytics: {
    id: import.meta.env.VITE_ANALYTICS_ID || '',
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
  },

  // Real-time Configuration
  realtime: {
    websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'wss://backend-production-219d.up.railway.app',
    enabled: import.meta.env.VITE_WEBSOCKET_ENABLED === 'true'
  },

  // External Services
  services: {
    email: import.meta.env.VITE_EMAIL_SERVICE_ENABLED === 'true',
    sms: import.meta.env.VITE_SMS_SERVICE_ENABLED === 'true'
  },

  // Security Configuration
  security: {
    cspEnabled: import.meta.env.VITE_CSP_ENABLED === 'true',
    xssProtection: import.meta.env.VITE_XSS_PROTECTION === 'true',
    contentTypeOptions: import.meta.env.VITE_CONTENT_TYPE_OPTIONS === 'true'
  },

  // Performance Configuration
  performance: {
    enableServiceWorker: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
    enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
    cacheStrategy: import.meta.env.VITE_CACHE_STRATEGY || 'network-first'
  },

  // Development Configuration
  development: {
    serverPort: parseInt(import.meta.env.VITE_DEV_SERVER_PORT) || 5173,
    serverHost: import.meta.env.VITE_DEV_SERVER_HOST || 'localhost',
    hotReload: import.meta.env.VITE_HOT_RELOAD === 'true'
  },

  // Production Configuration
  production: {
    apiUrl: import.meta.env.VITE_PROD_API_URL || 'https://your-api-domain.com/api',
    frontendUrl: import.meta.env.VITE_PROD_FRONTEND_URL || 'https://your-frontend-domain.com'
  },

  // Build Configuration
  build: {
    outputDir: import.meta.env.VITE_BUILD_OUTPUT_DIR || 'dist',
    sourcemap: import.meta.env.VITE_BUILD_SOURCEMAP === 'true',
    minify: import.meta.env.VITE_BUILD_MINIFY === 'true'
  },

  // Testing Configuration
  testing: {
    enabled: import.meta.env.VITE_TEST_ENABLED === 'true',
    coverageEnabled: import.meta.env.VITE_TEST_COVERAGE_ENABLED === 'true'
  },

  // Monitoring Configuration
  monitoring: {
    errorTracking: import.meta.env.VITE_ERROR_TRACKING_ENABLED === 'true',
    performanceMonitoring: import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED === 'true'
  },

  // Localization Configuration
  localization: {
    defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE || 'en',
    fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE || 'en',
    availableLocales: import.meta.env.VITE_AVAILABLE_LOCALES?.split(',') || ['en', 'es', 'fr']
  },

  // Custom Configuration
  custom: {
    themeColors: import.meta.env.VITE_CUSTOM_THEME_COLORS || '',
    logoUrl: import.meta.env.VITE_CUSTOM_LOGO_URL || '',
    faviconUrl: import.meta.env.VITE_CUSTOM_FAVICON_URL || ''
  }
};

// Helper functions
config.getApiUrl = (endpoint = '') => {
  return `${config.api.baseUrl}/${config.api.version}${endpoint}`;
};

config.getFullUrl = (path = '') => {
  if (config.env.isProduction) {
    return `${config.production.frontendUrl}${path}`;
  }
  return `http://${config.development.serverHost}:${config.development.serverPort}${path}`;
};

config.isFeatureEnabled = (feature) => {
  return config.features[feature] === true;
};

config.getThemeConfig = () => {
  return {
    theme: config.ui.theme,
    colors: config.custom.themeColors ? JSON.parse(config.custom.themeColors) : null
  };
};

config.getLocalizationConfig = () => {
  return {
    defaultLocale: config.localization.defaultLocale,
    fallbackLocale: config.localization.fallbackLocale,
    availableLocales: config.localization.availableLocales
  };
};

config.getSecurityHeaders = () => {
  const headers = {};
  
  if (config.security.cspEnabled) {
    headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
  }
  
  if (config.security.xssProtection) {
    headers['X-XSS-Protection'] = '1; mode=block';
  }
  
  if (config.security.contentTypeOptions) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }
  
  return headers;
};

export default config; 