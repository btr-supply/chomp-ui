# Admin: Configuration Management Specification

Configuration management interface for editing ingester and server configurations.

## 1. Route

- `/admin/{cluster-slug}/config`

## 2. Purpose

- **Ingester Configuration**: Edit YAML configurations for data ingesters
- **Server Configuration**: Modify API server settings
- **Configuration Testing**: Validate configurations before deployment
- **Version Management**: Track configuration changes and rollback capability

## 3. API Endpoints

All endpoints relative to the selected backend URL:

- `GET /admin/config/ingester`: Fetch current ingester configuration
- `GET /admin/config/server`: Fetch server configuration
- `POST /admin/config/ingester/validate`: Validate ingester YAML
- `POST /admin/config/server/validate`: Validate server YAML
- `POST /admin/config/ingester/update`: Update ingester configuration
- `POST /admin/config/server/update`: Update server configuration
- `POST /admin/config/ingester/test`: Test configuration ("Try" functionality)
- `POST /admin/config/rollback`: Revert to previous version
- `GET /admin/config/history`: Fetch version history

*NB: Configuration updates require container restarts since configs are mounted as read-only volumes.*

## 4. Page Structure

### 4.1. Tab 1: Ingester Configuration

#### YAML Editor
- **Dual Editing Modes**: WYSIWYG editing using Eemeli Aro's YAML library (best for preserving anchors and round-trip editing) or raw file editing with Prism editor
- **Features**: Syntax highlighting, error detection, auto-completion, line numbers
- **Validation**: Real-time syntax checking with error messages

#### Actions
- **Validate**: Server-side schema validation
- **Try**: Single-run testing without deployment
- **Save and Apply**: Save configuration and restart containers
- **Format**: Auto-format YAML with proper indentation
- **Restart**: Manual container restart

#### Configuration Testing
- **Live Preview**: Test configuration results in real-time
- **Resource Display**: Show generated resources using UI components
- **Performance Analysis**: Assess configuration impact

#### Version History
- **History Management**: View previous versions with metadata
- **Diff Visualization**: Compare configurations side-by-side
- **Rollback**: Revert to previous versions
- **Export**: Download specific configuration versions

### 4.2. Tab 2: Server Configuration

#### Server Settings Editor
- **YAML Editor**: Full editor for server configuration
- **Categories**: Host/port, authentication, rate limiting, database, cache, security
- **Live Preview**: Real-time preview of settings
- **Apply Changes**: Save and restart API server

#### Configuration Cards

**Authentication Settings**:
- JWT configuration (secret, expiration, issuer)
- Authentication methods (static, Web3, OAuth2)
- Method-specific settings

**Rate Limiting**:
- Per-endpoint limits
- User-specific limits
- Burst allowances
- Real-time usage monitoring

**Server Information**:
- Base URL and WebSocket endpoint
- Server version and build info
- Database and cache connection status
- Health check endpoints

**Security Settings**:
- CORS configuration (origins, headers, methods)
- SSL/TLS settings
- Security headers

## 5. Technical Requirements

### Configuration Management
- **File Handling**: Support for multiple configuration files
- **Status Indicators**: Active/mounted status, timestamps, validation status
- **Error Handling**: Detailed error messages with line numbers

### Testing Features
- **Configuration Validation**: Syntax and schema validation
- **Single-Run Testing**: Test without affecting production
- **Impact Assessment**: Performance and resource impact analysis

### Version Control
- **History Tracking**: Comprehensive version history
- **Diff Comparison**: Visual comparison between versions
- **Rollback Safety**: Confirmation dialogs and rollback capabilities

### User Interface
- **Responsive Design**: Works on desktop and tablet
- **Keyboard Shortcuts**: Standard editor shortcuts
- **Progress Indicators**: For long-running operations (restarts, validation)
- **Confirmation Dialogs**: For destructive operations

## 6. Error Handling

- **Validation Errors**: Clear error messages with line numbers
- **Network Errors**: Graceful handling of API failures
- **Configuration Errors**: Detailed error descriptions and suggestions
- **Restart Failures**: Rollback options if container restart fails
