# Resource Page Specification

This document specifies the design and functionality of individual resource pages, accessed when clicking on a resource from the schema table.

## 1. Overview

The Resource page provides detailed information about a specific resource ingested in a Chomp cluster. It displays resource metadata, schema information, and data visualization based on the resource type (update or timeseries).

## 2. Associated Route

- `/resource/{cluster-slug}/{resource-name}`: Individual resource details and data visualization
- Accessible to all users for public resources, authenticated users only for protected resources

## 3. Purpose

- **Resource Metadata**: Display comprehensive schema information and configuration
- **Data Visualization**: Show timeseries charts and data tables based on resource type
- **Historical Analysis**: Provide historical data access with configurable time windows
- **Data Export**: Enable data export for analysis and reporting
- **Real-time Monitoring**: Display live data for timeseries resources

## 4. Data Sources (API Endpoints)

All endpoints relative to the selected backend URL:

- `GET /{cluster-api}/schema`: Resource schema information and metadata
- `GET /{cluster-api}/last?resources={resource-name}`: Current/latest data points
- `GET /{cluster-api}/history?resources={resource-name}&interval={interval}&from={from}&to={to}`: Historical timeseries data
- `GET /{cluster-api}/list/{resource-name}?limit={limit}&offset={offset}`: Paginated update resource data

## 5. Component Breakdown & Functionality

### 5.1. Resource Header Section

#### Resource Information
- **Resource Name**: Large, prominent display of the resource name
- **Resource Type**: Badge indicating type (update, series, timeseries)
- **Protection Status**: Indicator for protected resources (lock icon)
- **Last Updated**: Timestamp of most recent data point
- **Status Indicator**: Health status (active, inactive, error)

#### Navigation Controls
- **Back to Schema**: Breadcrumb navigation back to schema table
- **Cluster Context**: Display current cluster name and context
- **Share Resource**: Copy resource URL for sharing
- **Export Data**: Download current view data as CSV/JSON

### 5.2. Resource Metadata Section

#### Schema Information
- **Data Source**: Origin ingester and configuration
- **Fields**: List of available fields with types and descriptions
- **Ingestion Rate**: For timeseries resources, display ingestion frequency
- **Data Retention**: Retention policy and storage duration
- **Aggregation**: Aggregation methods and intervals available

#### Configuration Details
- **Ingester Config**: Display relevant ingester configuration
- **Field Mappings**: Show how raw data maps to resource fields
- **Validation Rules**: Data validation and constraint information
- **Tags/Labels**: Resource categorization and metadata tags

### 5.3. Data Visualization (Resource Type Dependent)

#### Timeseries Resources
**Historical Chart Section**:
- **Multi-line Charts**: Chart.js visualization with field selection
- **Field Toggles**: Checkboxes to show/hide specific fields
- **Time Range Controls**: Date picker for custom time ranges
- **Interval Selection**: Dropdown for aggregation intervals (m1, m5, m15, h1, h4, d1)
- **Zoom Controls**: Pan and zoom functionality for detailed analysis
- **Export Chart**: Download chart as PNG/SVG

**Data Table Section** (below chart):
- **Columns**: `ts` (timestamp), and all available fields
- **Sorting**: Latest first (ts descending) by default
- **Pagination**: Virtual scrolling for large datasets
- **Filtering**: Column-level filtering capabilities
- **Export**: Export visible data as CSV/JSON

#### Update Resources
**Data Table Only**:
- **Columns**: `created_at`, `updated_at`, `uid`, and all resource fields
- **Sorting**: Multiple column sorting with indicators
- **Pagination**: Traditional pagination with page size controls
- **Search**: Full-text search across all fields
- **Filtering**: Column-level filtering with type-specific controls
- **Export**: Export visible data as CSV/JSON

### 5.4. User Preferences & Settings

#### Default Settings (stored in user preferences)
- **Lookback Period**: Default to 1 day
- **Stop Time**: Default to now
- **Interval**: Default to m15 (15 minutes)
- **Chart Fields**: Remember field selection per resource
- **Table Page Size**: Default table pagination size

#### Customization Options
- **Time Range Presets**: Quick access to common ranges (1h, 6h, 1d, 1w, 1m)
- **Field Preferences**: Remember which fields to display by default
- **Chart Configuration**: Line colors, chart type preferences
- **Export Preferences**: Default export format and options

### 5.5. Real-time Features

#### Live Data Updates
- **Auto-refresh**: Configurable auto-refresh intervals (30s, 1m, 5m, off)
- **WebSocket Updates**: Real-time data streaming for timeseries resources
- **Update Indicators**: Visual indicators when new data arrives
- **Notification**: Optional browser notifications for significant changes

#### Performance Optimization
- **Data Caching**: Intelligent caching of historical data
- **Progressive Loading**: Load most recent data first, then historical
- **Memory Management**: Efficient handling of large datasets
- **Background Updates**: Non-blocking data updates

## 6. Visual Design & User Experience

### 6.1. Modern Interface Design
- **Clean Layout**: Generous whitespace with clear visual hierarchy
- **Card-Based Sections**: Organized information in distinct sections
- **Responsive Design**: Optimized for desktop and mobile viewing
- **GitHub/Apple Style**: Clean, minimal aesthetic following theme.ts

### 6.2. Data Visualization
- **Professional Charts**: Chart.js with custom styling and interactions
- **Color Consistency**: Use theme colors for consistent branding
- **Interactive Elements**: Hover tooltips, zoom controls, field selection
- **Accessibility**: Screen reader support and keyboard navigation

### 6.3. Information Density
- **Efficient Space Usage**: Maximize information display without clutter
- **Progressive Disclosure**: Show essential information first, details on demand
- **Context Awareness**: Relevant actions and information based on resource type
- **Visual Hierarchy**: Clear importance ordering through typography and spacing

## 7. Performance & Optimization

### 7.1. Data Loading Strategy
- **Lazy Loading**: Load data only when sections are visible
- **Pagination**: Efficient data fetching for large datasets
- **Caching**: TanStack Query caching with appropriate TTL
- **Error Handling**: Graceful fallbacks for failed data requests

### 7.2. Chart Performance
- **Data Decimation**: Intelligent data point reduction for large datasets
- **Render Optimization**: Efficient chart rendering with React.memo
- **Memory Management**: Cleanup of chart instances and data
- **Responsive Updates**: Smooth updates without flickering

## 8. Access Control & Security

### 8.1. Resource Protection
- **Public Resources**: Available to all users without authentication
- **Protected Resources**: Require valid JWT authentication
- **Field-level Security**: Potential for future field-level access control
- **Data Masking**: Mask sensitive data based on user permissions

### 8.2. Data Privacy
- **Export Controls**: Respect resource protection in data exports
- **URL Security**: Prevent unauthorized access through direct URLs
- **Session Management**: Proper handling of authentication state
- **Audit Logging**: Log access to protected resources

## 9. Integration with Schema Discovery

### 9.1. Navigation Flow
- **Schema Table Origin**: Seamless navigation from schema table
- **Context Preservation**: Maintain cluster context and filters
- **Back Navigation**: Proper browser history management
- **Deep Linking**: Support for direct resource URLs

### 9.2. Monitoring Integration
- **Monitor Resources**: Special handling for sys.*.ins.monitor and sys.*.ing.monitor
- **Metric Interpretation**: Proper display of monitoring metrics
- **Alert Integration**: Show related alerts and thresholds
- **Performance Context**: Link to broader system performance

This resource page provides comprehensive access to individual resource data while maintaining the clean, efficient design principles of the Chomp Frontend architecture.
