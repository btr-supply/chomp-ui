# Schema Discovery Specification (`/schema/{cluster-slug}`)

This document specifies the design and functionality of the resource discovery page that displays all ingesters (database schema and available data resources) of any selected Chomp backend instance.

## 1. Overview

The schema discovery page provides a **backend-independent interface** to explore database schemas and available data resources of any Chomp instance. This page serves as the primary "Explore" destination, transforming Chomp into a no-code platform by allowing users to discover what data is available through any Chomp deployment without requiring authentication.

## 2. Associated Routes

- `/schema/{cluster-slug}`: Schema exploration for specific backend cluster
- `/schema/{cluster-slug}?filter={regex}`: Filtered view of resources matching regex pattern
- **Monitoring Access**:
  - `/admin/{cluster-slug}/monitoring/instances` → redirects to `/schema/{cluster-slug}?filter=sys\..*\.ins\.monitor`
  - `/admin/{cluster-slug}/monitoring/resources` → redirects to `/schema/{cluster-slug}?filter=sys\..*\.ing\.monitor`
- Requires backend selection in directory before access

## 3. Purpose

- **Universal Data Discovery**: Explore data schemas across any Chomp backend instance
- **Public Access**: No authentication required for non-protected resources
- **Protected Resource Access**: Authentication required for `protected: true` resources
- **Real-time API Documentation**: Live API documentation based on actual backend data
- **Backend Demonstration**: Showcase the full capabilities of the selected Chomp instance
- **Data Architecture Visualization**: Clear, comprehensive view of available data structures
- **No-Code Data Access**: Enable non-technical users to understand and access any Chomp deployment
- **Monitoring Integration**: Direct access to instance and resource monitoring data for admins

## 4. Prerequisites

**Backend Selection Required**: Users must have selected a backend instance from `/directory` before accessing this page. If no backend is selected, users are automatically redirected to the backend selection page with explore intent.

## 5. Data Sources (API Endpoints)

All endpoints are relative to the selected backend URL with **15-minute caching via TanStack Query**:

### Primary Endpoints
- **Schema Discovery**: `GET ${selectedBackendUrl}/schema` - Complete schema information with 15-minute cache
- **Backend Info**: `GET ${selectedBackendUrl}/ping` - Backend version, metadata, and health status
- **Sample Data**: `GET ${selectedBackendUrl}/last/{resource}` - Recent data examples for preview

### Advanced Query Parameters (for /schema endpoint)
- `name`: Filter resources by name (regex support)
- `tag`: Filter resources by tags (regex support)
- `ingester_type`: Filter by ingester type (`http_api`, `evm_caller`, `ws_api`, etc.)
- `resource_type`: Filter by resource type (`timeseries`, `update` objects)
- `field_type`: Filter fields by data type (`float64`, `string`, `timestamp`, etc.)
- `last_updated`: Filter by data freshness (last N hours/days)
- `include_protected`: Include protected resources (requires authentication)

## 6. Component Breakdown & Functionality

### 6.1. Backend Context Header

#### Selected Backend Display
- **Backend Name**: Prominent display name of the current backend
- **Backend URL**: Show the API endpoint being used (with copy functionality)
- **Connection Status**: Real-time connectivity indicator with health metrics
- **Switch Backend**: Quick link to return to backend selection with current context
- **Backend Type**: Visual indicator (Public, Custom, Development)

#### Backend Cluster Information Dashboard
- **Cluster Name**: Backend provided name (eg. BTR Markets)
- **Version**: Backend Chomp version
- **Uptime**: How long the cluster has been running
- **Last Schema Update**: When schema was last refreshed (with 15-minute cache indicator)
- **Data Freshness**: Overall data freshness indicator across all resources
- **WebSocket Status**: Real-time data streaming availability
- **Ping**: latency in milliseconds

### 6.2. Advanced Filtering & Search Interface

#### Comprehensive Search Controls
- **Resource Name Search**: Real-time text input with regex support and suggestions
- **Tag Filter**: Multi-select tag filtering with autocomplete
- **Advanced Type Filters**: Multi-level dropdown selections:
  - **Ingester Type**: `http_api`, `evm_caller`, `ws_api`, `processor`, `sui_caller`, `svm_caller`
  - **Resource Type**: `timeseries` (charts + tables), `update` (paginated objects)
  - **Field Type**: `float64`, `string`, `timestamp`, `json`, `array`
  - **Protection Level**: Public, Protected (admin only)

#### Smart Filtering Features
- **Real-time Updates**: Filter results update as user types with debouncing
- **URL State Management**: Filter state preserved in URL parameters
- **Filter Presets**: Common filters (e.g., monitoring (admin only), protected (admin only), public data)
- **Clear Filters**: Quick reset of all filters with confirmation
- **Filter Persistence**: Remember filters during session with localStorage

### 6.3. Comprehensive Resource Table Display

#### Table Structure
The schema is displayed as a **lean, clean table** with GitHub/Apple-style design principles:

#### Table Columns
- **Resource Name**: Clickable name that navigates to `/resource/{cluster-slug}/{resource-name}`
- **Type**: Resource type badge (timeseries, update)
- **Ingester Type**: Styled badge showing source type with icon
- **Fields Count**: Number of fields in the resource
- **Tags**: Interactive chip list of associated tags
- **Protected**: Lock icon for protected resources
- **Last Updated**: Relative time since last data point

#### Table Features
- **Infinite Virtual Pagination**: All entries loaded from backend (manageable size expected)
- **Real-time Search**: Instant filtering across all columns
- **Column Sorting**: Click column headers to sort
- **Column Visibility**: Show/hide columns via settings
- **Row Selection**: Multi-select for bulk operations
- **Export**: Export filtered results to CSV/JSON

### 6.4. Resource Detail Modal/Expandable Rows

#### Quick Preview Mode
When hovering:
- **Field Details**: Comprehensive field information table for the resource
  - **Field Name**: Database column name with copy-to-clipboard
  - **Data Type**: Type with visual icons (`float64`, `string`, `timestamp`, etc.)
  - **Target**: Storage destination/index information
  - **Tags**: Field-specific tags with filtering capability
  - **Description**: AI-generated field purpose descriptions (when available)
  - **Transient**: Indicator for transient fields
  - **Protected**: Indicator for protected fields

#### API Examples Section
- **Sample Queries**: Dynamic generation of sample API calls
- **cURL Examples**: Copy-paste ready command examples
- **Response Format**: Expected JSON structure preview

### 6.5. Monitoring Resource Integration

#### Protected Monitoring Access
For authenticated admin users, monitoring resources are accessible:

#### Instance Monitoring (`sys.*.ins.monitor`)
- **System Metrics**: CPU, memory, disk, network usage
- **Geolocation**: Instance location and ISP information
- **Resource Count**: Number of active resources per instance
- **Performance**: Instance performance metrics

#### Resource Monitoring (`sys.*.ing.monitor`)
- **Ingester Performance**: Latency, response bytes, status codes
- **Field Metrics**: Field count and processing statistics
- **Instance Association**: Which instance is running the ingester

#### Monitoring Redirects
- `/admin/{cluster-slug}/monitoring/instances` → `/schema/{cluster-slug}?filter=sys\..*\.ins\.monitor&include_protected=true`
- `/admin/{cluster-slug}/monitoring/resources` → `/schema/{cluster-slug}?filter=sys\..*\.ing\.monitor&include_protected=true`

## 7. Enhanced Visual Design

### 7.1. Lean Table Design (GitHub/Apple Style)

#### Clean Typography
- **IBM Plex Mono** for resource names and technical data
- **System font stack** for descriptive text
- **Consistent spacing** with Material-UI design tokens
- **Subtle borders** and minimal visual noise

#### Professional Color Scheme
- **Neutral grays** for table backgrounds
- **Semantic colors** for status indicators
- **Brand accents** for interactive elements
- **High contrast** for accessibility (WCAG 2.1 AA)

#### Responsive Behavior
- **Desktop**: Full table with all columns
- **Tablet**: Hidden less important columns, horizontal scroll
- **Mobile**: Stacked card layout with essential information

### 7.2. Interactive Elements

#### Hover States
- **Row highlighting** on hover with smooth transitions
- **Column sorting** indicators on header hover
- **Quick actions** appear on row hover (view, copy API)

#### Loading States
- **Skeleton UI** for table loading
- **Progressive enhancement** as data becomes available
- **Shimmer effects** for smooth perceived performance

## 8. Error Handling & Offline Support

### 8.1. Robust Connection Management

#### Backend Connectivity
- **Connection Lost**: Clear messaging with reconnection attempts
- **Retry Logic**: Intelligent exponential backoff for reconnection
- **Fallback Mode**: Show cached schema (15-minute cache) when backend unreachable
- **Switch Backend**: Easy option to try different backend with context preservation

#### Advanced Data Loading States
- **Progressive Loading**: Load resources as they become available
- **Smart Skeleton UI**: Context-aware loading placeholders
- **Error Recovery**: Graceful handling of partial failures with retry options
- **Timeout Handling**: Clear messaging for slow responses

### 8.2. Comprehensive Graceful Degradation

#### Limited Connectivity Scenarios
- **Static Schema**: Basic schema display without live updates
- **Cached Data**: Display previously loaded schema with timestamps
- **Offline Indicators**: Clear marking of stale information
- **Reduced Functionality**: Hide features requiring connectivity

## 9. Performance Optimization & Caching

### 9.1. TanStack Query Integration

#### Intelligent Caching Strategy
- **15-minute Schema Cache**: Primary schema data cached for 15 minutes as specified
- **Stale-While-Revalidate**: Show cached data immediately while fetching updates
- **Background Refresh**: Automatic background updates respecting cache policy
- **Cache Invalidation**: Smart invalidation on backend switches or manual refresh

#### Advanced Query Management
- **Parallel Queries**: Concurrent fetching of schema and metadata
- **Query Optimization**: Intelligent request batching
- **Error Boundaries**: Isolated error handling for different data sources

### 9.2. Frontend Performance

#### Virtual Scrolling & Optimization
- **Virtual Table**: Handle large resource lists efficiently
- **Lazy Field Loading**: Load field details only when needed
- **Memory Management**: Efficient cleanup of unused data
- **Bundle Optimization**: Code splitting for optimal performance

## 10. Resource Interaction

### 10.1. Navigation to Resource Details

When clicking on a resource name in the table:
- **Route**: Navigate to `/resource/{cluster-slug}/{resource-name}`
- **State Preservation**: Maintain current filter state in browser history
- **Loading Transition**: Smooth transition with loading indicator

### 10.2. Quick Actions

#### Copy Operations
- **Copy Resource Name**: One-click copy of resource name
- **Copy API URL**: Copy direct API endpoint for resource
- **Copy Field Names**: Bulk copy of all field names

#### Bulk Operations
- **Select Multiple**: Checkbox selection for multiple resources
- **Export Selection**: Export selected resources metadata
- **Compare Resources**: Side-by-side comparison of selected resources

This lean, table-based schema discovery page provides efficient access to all resources while maintaining the clean, GitHub/Apple-style aesthetics that prioritize information density and usability.
