# Admin: Monitoring Dashboard Specification

This document outlines the specifications for the simplified monitoring dashboard that provides system monitoring overview and integrates with the schema discovery system for detailed monitoring data.

## 1. Overview

The Monitoring Dashboard provides a high-level overview of system health and performance metrics. Instead of dedicated monitoring pages, it leverages the schema discovery system with intelligent filtering to display instance and resource monitoring data, making monitoring a natural extension of the resource discovery workflow.

## 2. Associated Route

- `/admin/{cluster-slug}/monitoring`: Monitoring overview dashboard with system metrics
- `/admin/{cluster-slug}/monitoring/instances`: Redirects to `/schema/{cluster-slug}?filter=sys\..*\.ins\.monitor`
- `/admin/{cluster-slug}/monitoring/resources`: Redirects to `/schema/{cluster-slug}?filter=sys\..*\.ing\.monitor`

## 3. Purpose

- **System Overview**: Provide centralized view of system health and performance
- **Monitoring Integration**: Seamlessly integrate with schema discovery for detailed monitoring
- **Quick Access**: Rapid navigation to instance and resource monitoring data
- **Performance Insights**: Display key performance indicators and trends
- **Alert Management**: Centralized view of system alerts and notifications

## 4. Data Sources (API Endpoints)

All endpoints relative to the selected backend URL:

- `GET /{cluster-api}/schema`: All resource schemas including monitoring resources
- `GET /{cluster-api}/last?resources={monitor-resources}`: Latest monitoring data points
- `GET /{cluster-api}/history?resources={monitor-resources}&interval=m15`: Historical monitoring trends

## 5. Component Breakdown & Functionality

### 5.1. Monitoring Overview Dashboard

#### System Health Summary
- **Overall Status**: Aggregated health indicator (green/yellow/red)
- **Component Health**: Individual status for key system components
- **Uptime Metrics**: System uptime with availability percentage
- **Performance Score**: Composite performance metric with trend
- **Last Updated**: Timestamp of most recent monitoring data

#### Key Performance Indicators
- **Active Instances**: Count of running ingester instances
- **Data Ingestion Rate**: Current data points per second/minute
- **Response Times**: Average API response times
- **Error Rates**: System-wide error percentage
- **Resource Utilization**: CPU, memory, storage usage overview

### 5.2. Monitoring Navigation Hub

#### Quick Access Cards
**Instance Monitoring Card**:
- **Description**: "Monitor ingester instances and their performance"
- **Metrics Preview**: Count of active instances, average response time
- **Action Button**: "View Instance Monitors" → Redirects to `/schema/{cluster-slug}?filter=sys\..*\.ins\.monitor`
- **Status Indicator**: Overall instance health status

**Resource Monitoring Card**:
- **Description**: "Monitor resource ingestion and data quality"
- **Metrics Preview**: Count of active resources, ingestion rate
- **Action Button**: "View Resource Monitors" → Redirects to `/schema/{cluster-slug}?filter=sys\..*\.ing\.monitor`
- **Status Indicator**: Overall resource health status

#### Advanced Monitoring Features
**System Metrics Card**:
- **Real-time Metrics**: Live system performance indicators
- **Resource Usage**: CPU, memory, disk, network utilization
- **Database Status**: Connection health and query performance
- **Cache Status**: Redis health and performance metrics

### 5.3. Monitoring Data Integration

#### Schema Discovery Integration
- **Monitoring Resources**: Automatically identify sys.*.ins.monitor and sys.*.ing.monitor resources
- **Protected Access**: Monitoring resources accessible only to authenticated users
- **Filter Presets**: Pre-configured regex filters for monitoring data
- **Seamless Navigation**: Natural flow from overview to detailed monitoring data

#### Filter Implementation
**Instance Monitoring Filter**:
- **Regex Pattern**: `sys\..*\.ins\.monitor`
- **Matches**: All instance monitoring resources across all ingesters
- **Display**: Regular schema table with monitoring-specific context
- **Data Access**: Full timeseries data via resource pages

**Resource Monitoring Filter**:
- **Regex Pattern**: `sys\..*\.ing\.monitor`
- **Matches**: All resource monitoring resources across all ingesters
- **Display**: Regular schema table with monitoring-specific context
- **Data Access**: Full timeseries data via resource pages

### 5.4. Alert Management

#### Active Alerts Panel
- **Alert Summary**: Count of active alerts by severity
- **Recent Alerts**: List of most recent alerts with timestamps
- **Alert Categories**: Group alerts by system component
- **Quick Actions**: Acknowledge, dismiss, or escalate alerts
- **Alert Navigation**: Links to detailed alert information

#### Alert Integration
- **Schema Alerts**: Alerts related to specific monitoring resources
- **System Alerts**: General system health and performance alerts
- **Threshold Alerts**: Configurable threshold-based monitoring
- **Trend Alerts**: Alerts based on performance trends and patterns

### 5.5. Performance Trends

#### Historical Overview
- **Performance Graphs**: Mini-charts showing key metrics over time
- **Trend Indicators**: Up/down arrows for performance trends
- **Comparison Metrics**: Current vs. historical performance
- **Forecast Indicators**: Predicted performance based on trends

#### Monitoring Insights
- **Top Performing Resources**: Best performing monitored resources
- **Problem Areas**: Resources or instances with issues
- **Usage Patterns**: Peak usage times and patterns
- **Optimization Opportunities**: Suggestions for performance improvements

## 6. Visual Design & User Experience

### 6.1. Dashboard Layout
- **Clean Overview**: Spacious layout with clear visual hierarchy
- **Card-Based Design**: Organized information in interactive cards
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Professional Aesthetics**: Consistent with overall admin theme

### 6.2. Monitoring-Specific Elements
- **Status Indicators**: Color-coded health status with clear meaning
- **Performance Metrics**: Large, readable numbers for key metrics
- **Trend Visualizations**: Mini-charts and sparklines for trends
- **Action Buttons**: Clear call-to-action for accessing detailed monitoring

### 6.3. Integration Consistency
- **Seamless Transitions**: Smooth navigation to schema-filtered views
- **Context Preservation**: Maintain monitoring context in schema views
- **Consistent Styling**: Unified design language across monitoring and schema
- **Navigation Breadcrumbs**: Clear path for returning to monitoring overview

## 7. Redirect Route Implementation

### 7.1. Instance Monitoring Redirect
**Route**: `/admin/{cluster-slug}/monitoring/instances`
**Target**: `/schema/{cluster-slug}?filter=sys\..*\.ins\.monitor`
**Behavior**:
- Immediate redirect to schema page with instance monitoring filter
- Preserve any additional query parameters
- Maintain authentication context
- Show filtered results immediately

### 7.2. Resource Monitoring Redirect
**Route**: `/admin/{cluster-slug}/monitoring/resources`
**Target**: `/schema/{cluster-slug}?filter=sys\..*\.ing\.monitor`
**Behavior**:
- Immediate redirect to schema page with resource monitoring filter
- Preserve any additional query parameters
- Maintain authentication context
- Show filtered results immediately

### 7.3. Context Preservation
- **Monitoring Origin**: Schema page knows it was accessed from monitoring
- **Filter Persistence**: Applied filters remain active during session
- **Navigation Memory**: Back button returns to monitoring overview
- **Breadcrumb Updates**: Clear navigation path in filtered schema view

## 8. Performance & Optimization

### 8.1. Data Loading
- **Efficient Queries**: Optimized queries for monitoring overview data
- **Caching Strategy**: Appropriate caching for monitoring metrics
- **Progressive Loading**: Load critical metrics first
- **Background Updates**: Non-blocking updates for real-time data

### 8.2. Real-time Updates
- **WebSocket Integration**: Live updates for monitoring metrics
- **Update Throttling**: Prevent excessive UI updates
- **Selective Updates**: Update only changed metrics
- **Error Resilience**: Graceful handling of connection issues

## 9. Security & Access Control

### 9.1. Authentication Requirements
- **Protected Routes**: All monitoring routes require authentication
- **JWT Validation**: Secure access to monitoring data
- **Role-Based Access**: Potential for different monitoring access levels
- **Session Management**: Proper handling of authentication state

### 9.2. Data Protection
- **Monitoring Data Security**: Protect sensitive monitoring information
- **Access Logging**: Log access to monitoring resources
- **Data Masking**: Mask sensitive system information as needed
- **Secure Redirects**: Ensure redirect routes maintain security context

## 10. Integration Benefits

### 10.1. Unified Experience
- **Consistent Interface**: Same table interface for all resource types
- **Familiar Navigation**: Users already know schema table functionality
- **Reduced Complexity**: Fewer specialized monitoring interfaces
- **Maintenance Efficiency**: Single codebase for resource display

### 10.2. Enhanced Functionality
- **Full Resource Features**: All resource page features available for monitoring
- **Export Capabilities**: Export monitoring data using existing functionality
- **Search and Filter**: Full search capabilities across monitoring resources
- **Historical Analysis**: Complete historical data access for monitoring

This simplified monitoring architecture provides comprehensive system monitoring while leveraging the existing schema discovery infrastructure for detailed monitoring data access.
