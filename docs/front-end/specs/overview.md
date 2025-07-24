# Chomp Frontend Overview

High-level overview of the Chomp frontend application and its core design principles.

## 1. Core Concept

The Chomp frontend is a **backend-independent web interface** that connects to any Chomp deployment for configuration and monitoring. It transforms YAML-based configuration into a no-code interface with integrated monitoring through schema discovery.

## 2. Key Capabilities

- **Multi-Backend Support**: Connect to public instances, custom deployments, or localhost
- **Performance**: Process millions of data points per day on low-end hardware
- **Rapid Setup**: Configure multi-node clusters in minutes via web interface
- **Lightweight**: Manage backends running on Raspberry Pi to enterprise clusters
- **Multi-Modal**: Configure Web2 (HTTP, WebSockets) and Web3 (EVM, SVM, Sui) data sources
- **Unified Monitoring**: Schema-integrated monitoring using protected resources

## 3. User Paths

**Data Exploration**: Access public data without authentication through schema discovery
**Backend Management**: Configure and monitor Chomp deployments with integrated monitoring
**Self-Hosting**: Deploy own frontend with full feature compatibility

## 4. Architecture Highlights

### Schema-Integrated Monitoring
- **Simplified Architecture**: Monitoring leverages the existing schema discovery system
- **Protected Resources**: Instance and resource monitors (sys.*.ins.monitor, sys.*.ing.monitor) accessible to authenticated users
- **Unified Interface**: Same table and visualization tools for all resource types including monitoring
- **Efficient Navigation**: Monitoring overview dashboard with smart filtering to schema views

### Resource Management
- **Table-Based Schema**: Clean, lean table design for resource discovery
- **Advanced Filtering**: Regex filters and search capabilities
- **Real-time Data**: Live updates with 15-minute TanStack Query cache
- **Comprehensive Views**: Individual resource pages with charts and data tables

## 5. Technical Approach

- **Static Site**: Frontend deployed as static files, no server required
- **Dynamic Backend**: Connects to any Chomp API endpoint
- **Configuration Editing**: WYSIWYG editing using Eemeli Aro's YAML library (best for preserving anchors and round-trip editing) or raw file editing with Prism editor
- **Real-Time Monitoring**: Live data visualization through schema infrastructure
- **Performance Optimization**: Memoized components and efficient caching

## 6. Architecture Principles

- **Backend Independence**: No coupling to specific Chomp versions or deployments
- **Performance First**: Efficient caching and lazy loading
- **Type Safety**: TypeScript for reliability across different backends
- **Accessibility**: Works on any device with a modern browser
- **Monitoring Integration**: Natural extension of resource discovery workflow

## 7. Tech Stack Summary

- **Framework**: Next.js 14+ with static export
- **Language**: TypeScript (strict mode)
- **UI**: MUI (Material-UI) components with custom theme overrides
- **State**: Zustand (client), TanStack Query (server)
- **Code Editing**: Prism Editor and Eemeli Aro's YAML library
- **Charts**: Chart.js for comprehensive data visualization
- **Performance**: React.memo, useMemo, useCallback for optimization

## 8. Deployment Options

- **Public Access**: https://cho.mp (hosted, connects to any backend)
- **Self-Hosted**: Deploy own instance with custom branding
- **Development**: Local development with hot reload

For detailed technical information, see [architecture.mdx](./architecture.mdx).
