# Admin: Ingester Configuration Specification

This document outlines the specifications for the advanced ingester configuration management page that provides comprehensive YAML editing, testing capabilities, and configuration management for Chomp ingester configurations.

## 1. Overview

This page provides specialized configuration management specifically for ingester configurations, featuring advanced YAML editing with inheritance support, comprehensive testing capabilities, and professional configuration management tools. It serves as the dedicated interface for managing all aspects of data ingestion configuration.

## 2. Associated Route

- `/admin/{cluster-slug}/config/ingesters`: Advanced ingester configuration management interface

## 3. Purpose

- **Advanced Ingester Configuration**: WYSIWYG editing using Eemeli Aro's YAML library (best for preserving anchors and round-trip editing) or raw file editing with Prism editor
- **Configuration Testing**: "Try" button functionality for single-run validation and live preview
- **Safe Configuration Management**: Comprehensive validation and rollback capabilities
- **Configuration Versioning**: Complete version control and history management
- **Live Configuration Preview**: Real-time testing and validation of configuration changes
- **Professional YAML Editing**: Industry-standard YAML editor with advanced features

## 4. Data Sources (API Endpoints)

All endpoints relative to the selected backend URL:

- `GET /admin/config/ingester`: Fetch current raw YAML ingester configuration content
- `POST /admin/config/ingester/validate`: Server-side validation of ingester YAML before saving
- `POST /admin/config/ingester/update`: Submit new ingester configuration and apply changes
- `POST /admin/config/ingester/test`: Single-run configuration testing ("Try" functionality)
- `POST /admin/config/rollback`: Revert to previous configuration version
- `GET /admin/config/history`: Fetch configuration version history
- `GET /admin/ingesters/registry`: Fetch complete ingester registry for validation
- `POST /admin/config/ingester/format`: Auto-format YAML with inheritance preservation

**Note**: Configuration updates require ingester container restarts since configs are mounted at runtime as read-only volumes.

## 5. Enhanced Page Structure

### 5.1. Advanced YAML Configuration Editor

#### 5.1.1. Professional Configuration Editor Integration

- **Dual Editing Modes**: WYSIWYG editing using Eemeli Aro's YAML library (best for preserving anchors and round-trip editing) or raw file editing with Prism editor
- **YAML Inheritance Support**: Preserve YAML anchors and aliases when using WYSIWYG mode
- **Advanced Editor Features**:
  - Syntax highlighting with YAML-specific color schemes
  - Error detection and real-time validation with inline error indicators
  - Auto-completion for known configuration keys and values
  - Line numbers, code folding, and minimap for large configurations
  - Find and replace functionality with regex support and multi-file search
  - Multi-cursor editing and block selection capabilities
  - Bracket matching and intelligent indentation guides
  - Code snippets and templates for common configuration patterns

#### 5.1.2. Enhanced Configuration File Management

- **Multi-File Support**: Tabbed interface for editing multiple configuration files
- **File Explorer**: Tree view of all ingester configuration files
- **File Status Indicators**:
  - Active/mounted status with visual indicators
  - Last modified timestamps with relative time display
  - File size and line count information
  - Validation status (valid/invalid/untested) with color coding
  - Change detection with unsaved changes indicators

#### 5.1.3. Advanced Configuration Validation

**Real-time Validation**:
- **Syntax Validation**: Immediate YAML syntax checking as user types
- **Schema Validation**: Real-time validation against ingester configuration schema
- **Cross-Reference Validation**: Validate references between configuration sections
- **Dependency Validation**: Check for missing dependencies and circular references
- **Performance Impact Analysis**: Assess performance impact of configuration changes

**Validation Reporting**:
- **Detailed Error Messages**: Line-specific error messages with suggestions
- **Warning System**: Non-blocking warnings for potential issues
- **Validation Summary**: Comprehensive validation report with statistics
- **Quick Fix Suggestions**: Automated suggestions for common configuration errors

### 5.2. Configuration Testing & Preview ("Try" Functionality)

#### 5.2.1. Single-Run Configuration Testing

**Advanced Testing Capabilities**:
- **Dry Run Execution**: Test configuration without affecting production
- **Resource Generation Preview**: Preview what resources will be created
- **Data Flow Simulation**: Simulate data flow through the ingester pipeline
- **Performance Testing**: Assess performance impact of configuration changes
- **Error Scenario Testing**: Test configuration under various error conditions

**Test Results Display**:
- **Live Preview Interface**: Real-time display of test results
- **Resource Visualization**: Show generated resources using actual UI components
- **Data Sample Display**: Show sample data that would be generated
- **Performance Metrics**: Display performance metrics from the test run
- **Error Analysis**: Detailed analysis of any errors encountered during testing

#### 5.2.2. Configuration Preview & Comparison

**Side-by-Side Preview**:
- **Configuration vs. Results**: Show configuration alongside generated results
- **Before/After Comparison**: Compare current vs. new configuration impact
- **Diff Visualization**: Visual diff showing configuration changes
- **Impact Assessment**: Detailed assessment of configuration change impact

### 5.3. Advanced Configuration History & Version Control

#### 5.3.1. Comprehensive Version Management

**Version History Features**:
- **Complete Version History**: Track all configuration changes with metadata
- **Author Attribution**: Track who made each configuration change
- **Change Comments**: Add descriptive comments to configuration versions
- **Branch and Tag Support**: Create branches and tags for configuration versions
- **Merge Capabilities**: Merge configuration changes from different branches

#### 5.3.2. Advanced History Operations

**History Management**:
- **Visual Diff Viewer**: Side-by-side comparison of any two versions
- **Selective Rollback**: Rollback specific sections of configuration
- **Configuration Merging**: Merge changes from multiple configuration versions
- **Export/Import**: Export configuration versions and import from external sources
- **Backup Management**: Automated and manual backup creation and restoration

### 5.4. Configuration Templates & Snippets

#### 5.4.1. Template Library

**Pre-built Templates**:
- **Ingester Type Templates**: Templates for each type of ingester (http_api, evm_caller, etc.)
- **Common Patterns**: Templates for common configuration patterns
- **Best Practice Templates**: Templates following configuration best practices
- **Custom Templates**: User-created templates for organization-specific patterns

#### 5.4.2. Code Snippets & Auto-completion

**Smart Auto-completion**:
- **Context-Aware Suggestions**: Intelligent suggestions based on current context
- **Value Validation**: Real-time validation of configuration values
- **Documentation Integration**: Inline documentation for configuration options
- **Example Values**: Provide example values for configuration fields

### 5.5. Advanced Action Buttons & Operations

#### 5.5.1. Enhanced Configuration Actions

**Primary Actions**:
- **`Validate Configuration`**:
  - Multi-layer validation with detailed reporting
  - Real-time validation as user types
  - Validation history and trend analysis
  - Performance impact assessment during validation

- **`Try Configuration`** (Enhanced):
  - Comprehensive single-run testing without deployment
  - Live preview with actual resource page components
  - Performance benchmarking and analysis
  - Error scenario testing and recovery validation
  - Resource generation preview with sample data

- **`Save and Apply`**:
  - Atomic save operations with rollback capability
  - Pre-save validation and confirmation
  - Progressive deployment with health checks
  - Rollback on deployment failure
  - Deployment progress tracking and reporting

- **`Format YAML`**:
  - Advanced YAML formatting with inheritance preservation
  - Consistent indentation and styling
  - YAML anchor and alias optimization
  - Custom formatting rules and preferences

#### 5.5.2. Advanced Management Operations

**Configuration Management**:
- **`Export Configuration`**: Export in various formats (YAML, JSON, ZIP)
- **`Import Configuration`**: Import with validation and conflict resolution
- **`Clone Configuration`**: Create copies for testing and development
- **`Template Creation`**: Create reusable templates from current configuration
- **`Bulk Operations`**: Apply changes across multiple configuration files

### 5.6. Real-time Collaboration & Locking

#### 5.6.1. Multi-user Collaboration

**Collaboration Features**:
- **Real-time Editing**: Multiple users can view changes in real-time
- **Edit Locking**: Prevent conflicts with file-level or section-level locking
- **Change Notifications**: Notify users of configuration changes
- **Collaborative Comments**: Add comments and discussions to configuration sections

## 6. Advanced Visual Design

### 6.1. Professional Configuration Interface

- **Split-Pane Layout**: Editor and preview side-by-side when testing
- **Tabbed Interface**: Multiple configuration files in tabs
- **Status Bar**: Real-time validation status and file information
- **Action Toolbar**: Prominent placement of configuration actions
- **Minimap**: Overview of large configuration files

### 6.2. Enhanced Editor Styling

- **Professional Theme**: Dark theme optimized for YAML editing
- **Syntax Highlighting**: Comprehensive YAML-specific color scheme
- **Error Visualization**:
  - Red underlines for syntax errors
  - Yellow highlights for warnings
  - Blue highlights for suggestions
  - Hover tooltips with detailed error information
- **Success Indicators**: Green checkmarks and success animations
- **Performance Indicators**: Visual indicators for performance impact

### 6.3. Interactive Elements

- **Configuration Cards**: Clean display of configuration sections
- **Status Indicators**: Real-time color-coded badges for all states
- **Action Buttons**: Professional styling with loading states
- **Modal Dialogs**: Comprehensive confirmation dialogs for critical actions
- **Progress Indicators**: Real-time progress for long-running operations

## 7. Advanced Runtime Configuration Management

### 7.1. Enhanced Volume Mounting Integration

#### 7.1.1. Configuration File Management

- **Host Location**: `../ingesters/` directory with subdirectory support
- **Container Mount**: `/app/ingesters:ro` with nested configuration support
- **Environment Variables**:
  - `INGESTER_CONFIGS`: Comma-separated file list
  - `INGESTER_CONFIG_PATH`: Base path for configuration files
- **Update Process**: Atomic file updates with rollback capabilities

#### 7.1.2. Advanced Configuration Updates

- **Atomic Updates**: Ensure configuration consistency during updates
- **Rolling Restarts**: Minimize service interruption during updates
- **Health Checks**: Verify system health after configuration changes
- **Automatic Rollback**: Rollback on failed health checks
- **Configuration Sync**: Synchronize configuration across multiple instances

## 8. Comprehensive Safety Features

### 8.1. Advanced Validation & Testing

- **Multi-layer Validation**:
  - Real-time syntax checking with immediate feedback
  - Schema validation against configuration schema
  - Dependency validation between configuration sections
  - Cross-reference validation for related configurations
- **Testing Framework**:
  - Comprehensive testing suite for configuration validation
  - Performance testing and benchmarking
  - Error scenario testing and recovery validation
  - Integration testing with live data sources

### 8.2. Enhanced Backup & Recovery

- **Automatic Backup Strategy**:
  - Pre-change snapshots with comprehensive metadata
  - Scheduled configuration backups with retention policies
  - Cross-system backup synchronization
  - Backup integrity verification and testing
- **Recovery Options**:
  - Point-in-time recovery with precise timestamp selection
  - Selective configuration restoration
  - Disaster recovery procedures and automation
  - Configuration migration tools and utilities

## 9. Integration & Extensibility

### 9.1. External Tool Integration

**Development Tools**:
- **Git Integration**: Version control integration with Git repositories
- **CI/CD Integration**: Integration with continuous integration pipelines
- **External Editors**: Support for external YAML editors and IDEs
- **Configuration Management Tools**: Integration with Ansible, Terraform, etc.

### 9.2. API & Automation

**Programmatic Access**:
- **Configuration API**: RESTful API for configuration management
- **Webhook Support**: Webhooks for configuration change notifications
- **Automation Scripts**: Support for automated configuration deployment
- **Integration Libraries**: SDKs for popular programming languages

## 10. Performance & Scalability

### 10.1. Efficient Configuration Handling

- **Large File Support**: Efficient handling of large configuration files
- **Lazy Loading**: Load configuration sections on demand
- **Caching Strategy**: Multi-layer caching for optimal performance
- **Background Processing**: Non-blocking configuration operations

### 10.2. Real-time Capabilities

- **WebSocket Integration**: Real-time configuration updates and notifications
- **Live Validation**: Real-time validation without blocking the UI
- **Progressive Loading**: Load configuration data progressively
- **Efficient Diffing**: Efficient calculation of configuration differences

This advanced ingester configuration management page provides professional-grade configuration editing, testing, and management capabilities specifically designed for Chomp's ingester configurations, ensuring safe, efficient, and reliable configuration management.
