# Admin Dashboard Specification

This document specifies the design and functionality of the main admin dashboard page, which serves as the comprehensive entry point to all administrative functions for authenticated users.

## 1. Overview

The Admin Dashboard is the main hub for authenticated administrators, providing a high-level overview of the entire Chomp system's health, performance metrics, and operational status. It serves as the primary navigation point to detailed management pages and embodies the comprehensive admin interface for any Chomp backend deployment.

## 2. Associated Route

- `/admin/{cluster-slug}`: Main admin dashboard with backend context
- Protected route requiring valid JWT authentication

## 3. Purpose

- **Comprehensive Cluster Overview**: Provide administrators with centralized view of system health across all components
- **Navigation Hub**: Serve as the primary launchpad for navigating to specific admin sections
- **Real-time Monitoring**: Display live system metrics and performance indicators from `sys.*.monitor` resources
- **Quick Actions**: Enable rapid access to common administrative tasks (eg. ban user or stop all public API use by reducing temporary rate limits to 0 rpm)
- **Alert Management**: Centralized view of system alerts and notifications (WIP, no back-end)

## 4. Data Sources (API Endpoints)

All endpoints relative to the selected cluster backend URL:

- `GET /admin/dashboard/overview`: Comprehensive dashboard metrics and system status
- `GET /admin/ingesters`: Status and metrics for all ingester instances
- `GET /admin/database/status`: Database connection health and performance metrics
- `GET /admin/cache/status`: Redis cache health, memory usage, and performance
- `GET /admin/registry/instances`: Count and status of registered Chomp instances
- `GET /admin/system/metrics`: Overall system performance and resource utilization
- `GET /admin/alerts`: Active system alerts and recent notifications
- `GET /admin/audit/recent`: Recent administrative actions and changes

## 5. Enhanced Component Breakdown & Functionality

### 5.1. Comprehensive Dashboard Layout (Admin-Specific)

A sophisticated persistent layout wrapping all `/admin/{cluster-slug}/*` routes:

#### Enhanced Sidebar Navigation
A vertical navigation bar with comprehensive admin sections:

- **Dashboard** (`/admin/{cluster-slug}`): Main overview and metrics
- **Schema** (`/admin/{cluster-slug}/schema`): Resource discovery and monitoring data
- **Configuration** (`/admin/{cluster-slug}/config`): System configuration management
- **Users** (`/admin/{cluster-slug}/users`): User management and access control
- **Monitoring** (`/admin/{cluster-slug}/monitoring`): System monitoring overview and navigation
- **Logs** (`/admin/{cluster-slug}/logs`): System logs and debugging interface
- **Settings** (`/admin/{cluster-slug}/settings`): Admin interface settings and preferences

#### Dynamic Main Content Area
- **Responsive Layout**: Adapts to screen size with collapsible sidebar
- **Context Awareness**: Displays backend-specific information and branding
- **Real-time Updates**: Live updates for metrics and status information
- **Quick Actions Bar**: Frequently used actions accessible from all pages

### 5.2. Enhanced Dashboard Page Widgets

The main `/admin/{cluster-slug}` page features comprehensive system monitoring widgets:

#### System Health Overview Card
- **Overall Status**: Green/Yellow/Red indicator for system health
- **Component Status**: Individual status for each system component
- **Uptime Display**: System uptime with availability percentage
- **Performance Score**: Aggregated system performance metric
- **Quick Health Check**: Manual system health verification button

#### Resource & Monitoring Status Card
- **Data Source**: `GET /{cluster-api}/schema` filtered for monitoring resources
- **Comprehensive Metrics**:
  - **Total Resources**: Count of all ingested resources
  - **Monitoring Resources**: Count of active monitoring resources (sys.*.ins.monitor, sys.*.ing.monitor)
  - **Protected Resources**: Count of protected resources accessible to authenticated users
  - **Data Quality**: Overall data ingestion health and quality metrics
- **Real-time Updates**: Live status updates with WebSocket integration
- **Quick Actions**: View schema, access monitoring, refresh status
- **Navigation Links**: Direct links to schema discovery and monitoring dashboard

#### Instance Monitoring Quick View
- **Data Source**: `GET /{cluster-api}/last?resources={instance-monitors}`
- **Monitoring Integration**:
  - **Active Instances**: Count of running ingester instances
  - **Instance Health**: Overall health status of monitored instances
  - **Performance Metrics**: Average response time, throughput, error rate
  - **Recent Issues**: Count of instances with recent errors or warnings
- **Schema Integration**: Data sourced from sys.*.ins.monitor resources
- **Navigation Link**: Direct link to `/admin/{cluster-slug}/monitoring/instances` (redirects to filtered schema)

#### Resource Monitoring Quick View
- **Data Source**: `GET /{cluster-api}/last?resources={resource-monitors}`
- **Monitoring Integration**:
  - **Monitored Resources**: Count of resources with active monitoring
  - **Ingestion Rate**: Current data ingestion rate across all resources
  - **Data Quality Score**: Aggregated data quality metrics
  - **Alert Status**: Count of active alerts related to resource monitoring
- **Schema Integration**: Data sourced from sys.*.ing.monitor resources
- **Navigation Link**: Direct link to `/admin/{cluster-slug}/monitoring/resources` (redirects to filtered schema)

#### Database & Storage Status Card
- **Data Source**: `GET /admin/database/status`
- **Comprehensive Information**:
  - **Connection Status**: Connected/Disconnected with latency metrics
  - **Database Type**: Display type (TsdbProxy, TDengine, etc.) with version
  - **Storage Metrics**: Total storage used, available space, growth rate
  - **Table Count**: Number of active data tables and resources
  - **Performance**: Query response times, connection pool status
- **Health Indicators**: Connection quality, performance thresholds
- **Quick Actions**: Database health check, connection refresh

#### Cache & Memory Status Card
- **Data Source**: `GET /admin/cache/status`
- **Detailed Metrics**:
  - **Connection Status**: Redis connectivity with cluster information
  - **Memory Usage**: Used/total memory with utilization percentage
  - **Key Statistics**: Total keys, hit rate, eviction rate
  - **Performance**: Response times, throughput metrics
- **Real-time Monitoring**: Live memory usage graphs
- **Cache Management**: Clear cache, view hot keys, performance optimization

#### Data Flow & Ingestion Overview
- **Real-time Data Metrics**: Current ingestion rate, data volume
- **Resource Activity**: Most active resources and data sources
- **Performance Trends**: Hourly/daily ingestion patterns
- **Quality Indicators**: Data quality scores, error rates
- **Geographic Distribution**: Data source locations (if applicable)

#### System Resources & Performance Card
- **Server Metrics**: CPU usage, memory consumption, disk I/O
- **Network Statistics**: Bandwidth usage, connection counts
- **Process Information**: Running processes, resource allocation
- **Performance Alerts**: Threshold warnings and recommendations
- **Resource Optimization**: Suggestions for performance improvements

#### Recent Activity & Audit Log Preview
- **Administrative Actions**: Recent admin user actions with timestamps
- **System Changes**: Configuration changes, restarts, updates
- **User Activity**: Login events, authentication attempts
- **Alert History**: Recent alerts and their resolution status
- **Quick Access**: View full audit log link

#### Advanced Monitoring & Alerts Panel
- **Monitoring Integration**: Seamlessly integrate with schema-based monitoring
- **Active Alerts**: Current system alerts with severity levels
- **Monitoring Navigation**: Quick access to instance and resource monitoring
- **Performance Warnings**: Threshold warnings and recommendations
- **System Recommendations**: AI-powered optimization suggestions
- **Alert Management**: Acknowledge, dismiss, or escalate alerts

### 5.3. Schema-Integrated Monitoring

#### Monitoring Data Sources
- **Instance Monitors**: Resources matching `sys\..*\.ins\.monitor` pattern
- **Resource Monitors**: Resources matching `sys\..*\.ing\.monitor` pattern
- **Protected Access**: Monitoring resources accessible only to authenticated users
- **Real-time Data**: Live monitoring data through existing resource infrastructure

#### Dashboard Integration Benefits
- **Unified Data Model**: All monitoring data follows standard resource schema
- **Consistent Caching**: 15-minute cache via TanStack Query for monitoring data
- **Familiar Interface**: Same table and visualization tools for monitoring
- **Reduced Complexity**: Fewer specialized monitoring components

## 6. Advanced Visual Design

### 6.1. Modern Dashboard Layout
- **Clean, Spacious Design**: Generous whitespace with clear visual hierarchy
- **Card-Based Interface**: Organized information in distinct, interactive cards
- **Responsive Grid**: Adaptive layout that works on all screen sizes
- **Professional Aesthetics**: Technical, Grafana-inspired theme with modern touches

### 6.2. Enhanced Visual Elements
- **Status Indicators**: Color-coded status with icons and animations
- **Performance Metrics**: Large, readable typography for key numbers
- **Progress Bars**: Visual indicators for utilization and performance
- **Trend Graphs**: Mini-charts showing performance trends over time
- **Interactive Tooltips**: Detailed information on hover/click

### 6.3. Accessibility & Usability
- **Keyboard Navigation**: Full keyboard accessibility for all elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast Mode**: Support for accessibility modes
- **Mobile Optimization**: Touch-friendly interface for mobile administrators

## 7. Performance & Optimization

### 7.1. Efficient Data Loading
- **Progressive Loading**: Load critical metrics first, then secondary information
- **Caching Strategy**: Intelligent caching of dashboard data with appropriate TTL
- **Background Updates**: Non-blocking updates that don't interrupt user workflow
- **Error Resilience**: Graceful degradation when individual metrics fail

### 7.2. Real-time Performance
- **WebSocket Optimization**: Efficient real-time data streaming
- **Update Throttling**: Prevent excessive UI updates while maintaining responsiveness
- **Memory Management**: Efficient cleanup of historical data and unused components
- **Network Efficiency**: Minimize bandwidth usage for real-time updates

## 8. Security & Access Control

### 8.1. Authentication & Authorization
- **JWT Validation**: Secure authentication for all admin access
- **Role-Based Access**: Different permission levels for different admin functions
- **Session Management**: Secure session handling with automatic expiration
- **Audit Logging**: Complete logging of all administrative actions

### 8.2. Data Protection
- **Sensitive Data Masking**: Appropriate masking of sensitive information
- **Secure Communication**: Encrypted communication for all admin operations
- **Input Validation**: Comprehensive validation of all user inputs
- **CSRF Protection**: Protection against cross-site request forgery

This enhanced admin dashboard provides a comprehensive, real-time view of any Chomp deployment, enabling efficient system administration and monitoring for backend-independent operations.
