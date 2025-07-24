# Chomp Frontend

Web interface for configuring and monitoring Chomp data ingestion deployments. Hosted at **[cho.mp](https://cho.mp)** for instant access to any Chomp backend.

## Access Options

**Hosted Interface** - Use cho.mp to connect to:

- Public instances from the curated directory
- Custom backends you add
- Local development (localhost:40004)
- Self-hosted deployments

## Quick Start

### Using cho.mp (Recommended)

Visit **[cho.mp](https://cho.mp)** for immediate access to:

- Public data exploration
- Admin dashboard access
- Configuration editing
- Real-time monitoring

### Local Development

```bash
# Clone and setup
git clone https://github.com/btr-supply/chomp.git
cd chomp/ui

# Install dependencies (Bun required)
bun install

# Create environment file
cp .env.example .env.local

# Start development server
bun run dev
```

## Core Features

### No-Code Interface

- **Configuration Editing**: WYSIWYG editing using Eemeli Aro's YAML library (best for preserving anchors and round-trip editing) or raw file editing with Prism editor
- **Real-time Testing**: "Try" configurations with live preview
- **Data Visualization**: Interactive charts and tables for timeseries data

### Backend Management

- **Backend Directory**: Connect to public Chomp instances
- **Custom Backends**: Add and manage private deployments
- **Health Monitoring**: Real-time status of all backends
- **Authentication**: Dynamic auth methods per backend

### Admin Capabilities

- **Resource Monitoring**: Live data and ingester health
- **Configuration Management**: Hot-reload YAML configurations
- **User Management**: Access control and rate limiting
- **System Analytics**: Performance metrics and logs

## Architecture

### Backend Independence

- **Complete Decoupling**: Frontend works with any Chomp API
- **Dynamic Discovery**: Fetch capabilities from each backend
- **Per-Backend Auth**: Isolated authentication per instance
- **Graceful Fallback**: Handle varying backend capabilities

### Tech Stack

- **Next.js 14+** (App Router, static export)
- **TypeScript** (strict mode)
- **MUI** (Material-UI components)
- **TanStack Query** (server state with per-backend caching)
- **Zustand** (global state management)
- **Prism Editor** (raw YAML configuration editing)
- **Eemeli Aro's YAML Library** (WYSIWYG editing with anchor preservation)

## Data Types

### Update Resources (Objects)

- Paginated tables sorted by `updated_at`
- Full dataset export capability
- Examples: users, configurations, logs

### Timeseries Resources (Temporal Data)

- Multi-field line charts with selection controls
- Historical data tables with timestamp sorting
- Configurable timeframes and intervals
- Visible data range export

## Authentication

Frontend adapts to each backend's supported methods:

- **Static Tokens**: Admin access tokens
- **Web3 Wallets**: EVM (Ethereum & cie.), SVM (Solana & cie.), Sui signatures
- **OAuth2**: GitHub, Twitter/X (self-hosted deployments only)

_NB: OAuth2 not available on cho.mp due to callback URL requirements_

## Development

```bash
# Available scripts
bun run dev          # Development server with hot reload
bun run build        # Production build
bun run lint         # Code linting with Oxlint
bun run type-check   # TypeScript validation
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (public)/       # Public routes (landing, schema)
│   └── admin/          # Protected admin routes
├── components/         # Reusable React components
├── hooks/             # Custom React hooks
├── stores/            # Zustand global state
├── services/          # API interaction modules
└── utils/             # Utility functions
```

## Contributing

1. Read [Contributing Guidelines](../../CONTRIBUTING.md)
2. Review [Frontend Architecture](./docs/front-end/architecture.mdx)
3. Follow established patterns for backend independence

## License

MIT License - see [LICENSE](../../LICENSE)

**Web Interface**: [cho.mp](https://cho.mp) | **Documentation**: [docs/](./docs/) | **Community**: [Telegram](https://t.me/chomp_ingester)
