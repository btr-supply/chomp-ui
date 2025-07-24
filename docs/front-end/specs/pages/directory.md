# Directory (Backend Selection) Specification

This document specifies the design and functionality of the backend selection page that allows users to choose which Chomp backend instance to connect to, embodying Chomp's universal frontend architecture.

## 1. Overview

The directory page serves as the **universal connection interface** for the Chomp frontend, transforming Chomp from a low-code platform into a **no-code platform** through cho.mp. It enables complete frontend-backend decoupling, allowing any frontend to connect to any backend without deployment friction.

## 2. Associated Routes

- `/directory`: Main backend selection interface
- `/directory?to=login`: Backend selection with login intent (from landing page "Login" CTA)
- Accessible from both "Explore" and "Login" CTAs on the landing page

## 3. Purpose

- **Universal Access**: Connect to any Chomp backend without deployment friction
- **No-Code Transformation**: Enable non-technical users to access any Chomp deployment
- **Discovery**: Showcase available public Chomp instances with real-time health monitoring
- **Customization**: Allow users to add their own backend instances with full validation
- **Local Development**: Provide seamless access to localhost instances for developers
- **Session Management**: Establish the backend URL for the current session with persistence

## 4. Data Sources

### Backend Directory (Public Instances)

- **Source**: `https://raw.githubusercontent.com/btr-supply/chomp/refs/heads/main/directory.json`
- **Format**:
  ```json
  {
    "list": [
      {
        "name": "BTR Markets",
        "description": "Open market data aggregation and streaming platform",
        "url": "https://api.btr.markets",
        "logo": "https://cdn.btr.supply/assets/images/icons/btr-markets.svg",
        "sponsor_tiers": "1",
        "contributor": "true",
        "version": "v2.1.0",
        "uptime": "99.9%"
      }
    ]
  }
  ```

### User-Added Backends (Custom Instances)

- **Storage**: Browser localStorage with encryption
- **Key**: `chomp-custom-backends`
- **Format**: Array matching directory.json structure
- **Persistence**: Survives browser sessions and device changes
- **Validation**: Real-time backend validation and health checking

### Default Localhost Entry

- **Always Present**: Automatic entry for local development
- **Configuration**:
  ```json
  {
    "name": "Localhost",
    "description": "Local development instance",
    "url": "http://localhost:40004",
    "logo": null,
    "type": "development",
    "auto_detect": true
  }
  ```

### Extended Backend Directory (Environment Configuration)

- **Frontend .env Support**: Additional backends configurable via environment variables
- **Format**: Extends directory.json with environment-specific backends
- **Use Case**: Enterprise deployments with private backend instances

## 5. Component Breakdown & Functionality

### 5.1. Page Header

- **Navigation Breadcrumb**: `Home > Backend Selection`
- **Page Title**: "Connect to Chomp Instance"
- **Description**: "Choose a backend to explore data or authenticate with Chomp"
- **Back Button**: Return to landing page
- **Intent Indicator**: Show whether user came from "Explore" or "Login" CTA

### 5.2. Backend Categories

#### Public Instances Section

- **Title**: "Public Instances"
- **Description**: "Curated list of public Chomp deployments with real-time monitoring"
- **Loading State**: Skeleton cards while fetching directory.json
- **Error State**: Graceful fallback with offline cache if available
- **Refresh Button**: Manual refresh of public instance directory
- **Cards**: Responsive grid layout of available public backends

#### Custom Instances Section

- **Title**: "Your Custom Instances"
- **Description**: "Backend instances you've added and validated"
- **Empty State**: "No custom instances added yet - Add your first backend"
- **Management**: Full CRUD operations for custom backends
- **Import/Export**: Backup and restore custom backend configurations
- **Cards**: Grid layout matching public instances design

#### Development Section

- **Title**: "Development"
- **Description**: "Local development and testing environments"
- **Localhost Card**: Always present with auto-detection capabilities
- **Custom Dev URLs**: Support for non-standard development URLs
- **Health Check**: Real-time status indicator with latency measurements

### 5.3. Enhanced Backend Cards

Each backend instance displays as a comprehensive information card:

#### Visual Elements
- **Logo**: Instance logo with fallback to Chomp icon
- **Name**: Instance name with truncation handling
- **Description**: Multi-line description with expand/collapse
- **URL**: Backend API endpoint with copy-to-clipboard functionality
- **Status Indicator**: Real-time health check with detailed status:
  - 🟢 **Online**: Responding normally (< 1s) - Ready to connect
  - 🟡 **Slow**: Responding slowly (1-5s) - May experience delays
  - 🔴 **Offline**: Not responding or error - Connection failed
  - ⚪ **Unknown**: Not yet checked - Testing connectivity
  - 🔵 **Checking**: Health check in progress

#### Enhanced Metadata Badges
- **Sponsor Tier**: Visual tier indicators (Tier 1-3)
- **Contributor**: Badge for community contributing instances
- **Type**: Development/Production/Enterprise/Community
- **Version**: Backend version with compatibility indicators
- **Response Time**: Average response time display
- **Uptime**: Uptime percentage (when available)
- **Data Freshness**: Last data update timestamp

#### Comprehensive Actions
- **Connect Button**: Primary CTA with intent-aware text:
  - "Explore Data" for explore intent
  - "Login to Admin" for login intent
- **Health Check**: Manual health check trigger
- **Info Button**: Detailed instance information modal
- **Test Connection**: Advanced connection testing
- **Edit/Delete**: For custom backends only
- **Bookmark**: Save frequently used backends

### 5.4. Advanced Add Custom Backend Modal

Triggered by "Add Custom Backend" button with comprehensive validation:

#### Form Fields
- **Name**: Display name with uniqueness validation
- **Description**: Optional description with character limit
- **URL**: Backend API endpoint with advanced validation:
  - URL format validation
  - Protocol verification (HTTP/HTTPS)
  - CORS pre-flight checking
  - Reachability testing
- **Logo URL**: Optional logo with image validation
- **Tags**: Custom tags for organization
- **Authentication Method**: Pre-configure expected auth method

#### Advanced Validation
- **Real-time Validation**: Field-level validation as user types
- **Connection Testing**:
  - Health check at `/ping` endpoint
  - API capability detection
  - CORS compatibility verification
  - Response time measurement
- **Duplicate Prevention**: URL and name uniqueness checking
- **Schema Validation**: Verify backend provides expected API endpoints

#### Enhanced Actions
- **Test Connection**: Comprehensive backend validation
- **Import Configuration**: Import backend settings from JSON/YAML
- **Save & Connect**: Add backend and immediately connect
- **Cancel**: Close modal without saving

### 5.5. Comprehensive Instance Health Monitoring

Real-time health monitoring system for all backends:

#### Health Check Process
1. **Primary Health Check**: `GET ${backendUrl}/ping`
2. **API Capability Check**: `GET ${backendUrl}/auth/methods`
3. **Schema Availability**: `GET ${backendUrl}/schema` (header only)
4. **WebSocket Support**: Check WebSocket endpoint availability
5. **Timeout Handling**: Configurable timeout (default: 5 seconds)

#### Advanced Status Indicators
- **Response Time Tracking**: Historical response time graphs
- **Uptime Monitoring**: Track availability over time
- **Error Categorization**: Network vs. server vs. API errors
- **Compatibility Checking**: Feature compatibility matrix

#### Performance Metrics Dashboard
- **Response Time**: Real-time and historical averages
- **Uptime Percentage**: Rolling uptime calculations
- **Error Rate**: Failed request percentage
- **Last Checked**: Precise timestamp with auto-refresh
- **Feature Support**: Capability matrix (auth methods, WebSocket, etc.)

## 6. Enhanced User Experience Flow

### Selection Process with Intent Awareness

1. **User arrives** from landing page with specific intent:
   - "Explore" CTA → Schema exploration intent
   - "Login" CTA → Authentication intent
2. **Page loads** with intent-aware messaging and button labels
3. **Directory fetching** begins with progressive loading
4. **Health monitoring** starts for all visible backends
5. **User interaction** with real-time feedback and validation
6. **Backend selection** with intent-specific redirection:
   - Explore intent → `/schema/{cluster-slug}` page
   - Login intent → `/login` page with backend context

### Advanced Backend Selection Storage

- **Session Storage**: Current selection for active session
- **Local Storage**: Persistent backend preferences with:
  - Last used backend per intent type
  - Favorite backends list
  - Custom backend configurations
- **URL State Management**: Backend context in URL parameters
- **Cross-tab Synchronization**: Consistent backend selection across tabs

### Comprehensive Error Handling

- **Network Errors**: Graceful fallback with cached directory data
- **CORS Issues**: Detailed explanation with resolution steps
- **Invalid Backends**: Clear error messages with suggested fixes
- **Timeout Handling**: Progressive timeout with retry mechanisms
- **Partial Failures**: Graceful degradation when some backends fail

## 7. Advanced Visual Design

### Responsive Layout Structure

- **Desktop Grid**: 1-4 columns based on screen width with optimal spacing
- **Tablet Layout**: 2-3 columns with touch-optimized interactions
- **Mobile Design**: Single column with swipe gestures and optimized cards
- **Category Sections**: Clear visual hierarchy and separation
- **Progressive Enhancement**: Advanced features for capable devices

### Comprehensive Card Design

- **Uniform Sizing**: Consistent card dimensions with dynamic content handling
- **Visual Hierarchy**: Logo → Name → Description → Metadata → Actions
- **Interactive States**: Hover, active, and selected states with smooth animations
- **Status Integration**: Prominent health indicators with color coding
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation

### Advanced Filtering & Search

- **Real-time Search**: Instant filtering across all backend fields
- **Advanced Filters**:
  - Status (Online, Offline, Unknown)
  - Type (Public, Custom, Development)
  - Response Time (Fast, Medium, Slow)
  - Features (Auth methods, WebSocket support)
- **Sort Options**: Name, Status, Response Time, Last Used, Uptime
- **View Modes**: Grid, List, and Compact views

## 8. Performance Optimization

### Efficient Data Loading
- **Progressive Loading**: Load and display backends as they become available
- **Background Updates**: Non-blocking health check updates
- **Image Optimization**: Lazy loading and optimized logos
- **Caching Strategy**: Intelligent caching of directory and health data

### Real-time Updates
- **WebSocket Integration**: Live updates when available
- **Polling Optimization**: Intelligent polling intervals based on usage
- **Connection Pooling**: Efficient management of concurrent health checks
- **Debounced Actions**: Prevent excessive API calls during user interaction

## 9. Security & Privacy

### Data Protection
- **Local Storage Encryption**: Encrypt sensitive custom backend data
- **URL Sanitization**: Validate and sanitize all backend URLs
- **CORS Validation**: Verify cross-origin request compatibility
- **Privacy Protection**: No tracking of user backend selections

### Security Measures
- **Input Validation**: Comprehensive validation of all user inputs
- **XSS Prevention**: Sanitize all user-provided content
- **CSRF Protection**: Secure form submissions
- **Rate Limiting**: Prevent abuse of health check endpoints

This enhanced directory page transforms Chomp into a truly universal, no-code data platform by providing seamless backend discovery and connection capabilities for users of all technical levels.
