// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  code?: number;
  message?: string;
  trace_id?: string;
}

// Authentication Types
export interface LoginRequest {
  token: string;
  auth_method: string;
}

export interface LoginResponse {
  success: boolean;
  jwt_token: string;
  message: string;
  user_id: string;
  expires_hours: number;
}

export interface AuthStatus {
  authenticated: boolean;
  message: string;
  user_id?: string;
}

// System Status Types
export interface PingResponse {
  name: string;
  version: string;
  status: string;
  ping_ms: number;
  server_time: number;
  id: string;
  ip: string;
}

// Rate Limiting Types
export interface RateLimit {
  cap: number;
  remaining: number;
  ttl: number;
  reset: string;
}

export interface RateLimitStatus {
  rpm: RateLimit;
  rph: RateLimit;
  rpd: RateLimit;
  spm: RateLimit;
  sph: RateLimit;
  spd: RateLimit;
  ppm: RateLimit;
  pph: RateLimit;
  ppd: RateLimit;
}

// Schema Types
export interface FieldSchema {
  type: string;
  target: string;
  tags: string[];
  transient: boolean;
}

export interface ResourceSchema {
  ingester_type: string;
  resource_type: string;
  tags: string[];
  fields: Record<string, FieldSchema>;
}

export type SchemaResponse = Record<string, ResourceSchema>;

// Historical Data Types
export interface HistoryResponse {
  columns: string[];
  types: string[];
  data: (string | number | null)[][];
}

// Analysis Types
export interface AnalysisMetrics {
  std?: number;
  wstd?: number;
  ewstd?: number;
  mad?: number;
  atr?: number;
  sma?: number;
  ema?: number;
  roc?: number;
  rsi?: number;
  macd_line?: number;
  macd_signal?: number;
  macd_histogram?: number;
}

// Admin Types
export interface IngesterStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  last_ingested?: string;
  cached: boolean;
  streamed: boolean;
  field_count: number;
  uptime?: number;
  last_error?: string;
  resource_usage: {
    latency_ms?: number;
    response_bytes?: number;
    status_code?: number;
  };
}

export interface IngestersResponse {
  ingesters: IngesterStatus[];
  total_count: number;
  running_count: number;
  timestamp: string;
}

export interface DatabaseStatus {
  connected: boolean;
  type: string;
  host: string;
  port: number;
  database: string;
  tables_count: number;
}

export interface CacheStatus {
  connected: boolean;
  memory_usage: string;
  total_keys: number;
  version: string;
  uptime: number;
}

// Legacy Instance compatibility (will be removed)
// Use the updated Instance interface below

// Configuration Types
export interface ServerConfig {
  host: string;
  port: number;
  ws_ping_interval: number;
  ws_ping_timeout: number;
  auth_methods: string[];
  static_auth_token?: string;
  jwt_expires_hours: number;
  protected_routes: string[];
  protected_resources: string[];
  default_rate_limits: {
    rpm: number;
    rph: number;
    rpd: number;
    spm: number;
    sph: number;
    spd: number;
    ppm: number;
    pph: number;
    ppd: number;
  };
  input_rate_limits: {
    start: number;
    factor: number;
    max: number;
  };
}

// WebSocket Types
export interface WebSocketMessage {
  action: 'subscribe' | 'unsubscribe' | 'ping' | 'keepalive';
  topics?: string[];
}

export interface WebSocketResponse {
  success?: boolean;
  subscribed?: string[];
  error?: string;
  [key: string]: unknown; // For actual data messages
}

// Backend Model Types (ported from Python model.py)

// Literal Types
export type ResourceType = 'update' | 'series' | 'timeseries';

export type IngesterType =
  | 'scrapper'
  | 'http_api'
  | 'ws_api'
  | 'fix_api'
  | 'evm_caller'
  | 'evm_logger'
  | 'svm_caller'
  | 'svm_logger'
  | 'sui_caller'
  | 'sui_logger'
  | 'aptos_caller'
  | 'aptos_logger'
  | 'ton_caller'
  | 'ton_logger'
  | 'processor';

export type AuthMethod = 'static' | 'email' | 'oauth2_x' | 'oauth2_github' | 'evm' | 'svm' | 'sui';

export type UserStatus = 'public' | 'admin' | 'banned';

export type FieldType =
  | 'int8'
  | 'uint8'
  | 'int16'
  | 'uint16'
  | 'int32'
  | 'uint32'
  | 'int64'
  | 'uint64'
  | 'float32'
  | 'ufloat32'
  | 'float64'
  | 'ufloat64'
  | 'bool'
  | 'timestamp'
  | 'string'
  | 'binary'
  | 'varbinary';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type Interval = string; // e.g., "h1", "m30", "s10"

// Rate Limiting Configuration
export interface RateLimitConfig {
  rpm: number;
  rph: number;
  rpd: number;
  spm: number;
  sph: number;
  spd: number;
  ppm: number;
  pph: number;
  ppd: number;
}

export interface InputRateLimitConfig {
  start: number;
  factor: number;
  max: number;
}

// Targettable Interface (base for ResourceField and Ingester)
export interface Targettable {
  name: string;
  target: string;
  selector: string;
  method: HttpMethod;
  pre_transformer: string;
  headers: Record<string, string>;
  params: unknown[] | Record<string, unknown>;
  type: FieldType;
  handler: string;
  reducer: string;
  actions: unknown[];
  transformers: string[];
  tags: string[];
}

// ResourceField Interface - inherits from parent Resource defaults
export interface ResourceField {
  // Core field attributes (always required)
  name: string;
  type: FieldType; // Field type is always required
  transient: boolean;
  protected: boolean;
  value?: unknown;

  // Targettable attributes (optional - inherit from parent Resource/Ingester when not set)
  target?: string;
  selector?: string;
  method?: HttpMethod;
  pre_transformer?: string;
  headers?: Record<string, string>;
  params?: unknown[] | Record<string, unknown>;
  handler?: string;
  reducer?: string;
  actions?: unknown[];
  transformers?: string[];
  tags?: string[];
}

// Resource Interface
export interface Resource {
  name: string;
  resource_type: ResourceType;
  protected: boolean;
  fields: ResourceField[];
  data_by_field: Record<string, unknown>;
}

// Base Ingester Interface (extends both Resource and Targettable)
export interface BaseIngester extends Resource, Targettable {
  interval: Interval;
  probablity: number; // NB: keeping original typo from backend
  ingester_type: IngesterType;
  started?: string; // ISO string or null
  last_ingested?: string; // ISO string or null
  // NB: cron and monitor are omitted as they're runtime-specific
}

// UpdateIngester Interface (for update/upsert data)
export interface UpdateIngester extends BaseIngester {
  resource_type: 'update';
  uid: string; // Primary key for upserts
  created_at?: string; // ISO string
  updated_at?: string; // ISO string
}

// TimeSeriesIngester Interface (for time series data)
export interface TimeSeriesIngester extends BaseIngester {
  resource_type: 'timeseries';
  ts?: string; // ISO string
}

// User Interface (extends UpdateIngester)
export interface User extends UpdateIngester {
  // Identity fields
  uid: string;
  ipv4: string;
  ipv6: string;
  alias: string;
  status: UserStatus;

  // API usage tracking
  total_count: number;
  schema_count: number;
  last_count: number;
  history_count: number;
  analysis_count: number;

  // Byte usage tracking
  total_bytes: number;
  schema_bytes: number;
  last_bytes: number;
  history_bytes: number;
  analysis_bytes: number;

  // Rate limiting (transient)
  rate_limits: RateLimitConfig;

  // Session management (transient)
  jwt_token?: string;
  session_expires_at?: string;
  last_activity_at?: string;
}

// ResourceMonitor Interface (extends TimeSeriesIngester)
export interface ResourceMonitor extends TimeSeriesIngester {
  instance_name: string;
  field_count: number;
  latency_ms: number;
  response_bytes: number;
  status_code?: number;
}

// InstanceMonitor Interface (extends TimeSeriesIngester)
export interface InstanceMonitor extends TimeSeriesIngester {
  resources_count: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_usage: number;
  instance: Instance;
}

// Generic Ingester type (union of all ingester types)
export type Ingester =
  | BaseIngester
  | UpdateIngester
  | TimeSeriesIngester
  | User
  | ResourceMonitor
  | InstanceMonitor;

// Instance Interface (updated to match backend model)
export interface Instance {
  // Core identification
  pid: number;
  hostname: string;
  uid: string;
  ipv4: string;
  ipv6: string;
  name: string;
  mode: 'ingester' | 'server';
  resources_count: number;
  monitored: boolean;
  started_at: string; // ISO string
  updated_at: string; // ISO string
  args: Record<string, unknown>;

  // Geolocation and ISP information (cached, transient)
  coordinates: string; // "lat,lon" format
  timezone: string;
  country_code: string;
  location: string; // "city, region, country" format
  isp: string;

  // Legacy frontend compatibility fields (optional)
  id?: string;
  status?: 'online' | 'offline' | 'warning';
  uptime?: string;
  cpu?: number;
  memory?: number;
  disk_usage?: number;
  network_usage?: number;
  requests?: number;
  errors?: number;
  lastSeen?: string;
  version?: string;
}

// Directory Types
export interface DirectoryEntry {
  name: string;
  description: string;
  url: string;
  logo: string;
  sponsor_tiers: string;
  contributor: string;
}

export interface Directory {
  list: DirectoryEntry[];
}

// Deployment Types
export type DeploymentType = 'generic' | 'hosted' | 'local';

export interface DeploymentConfig {
  type: DeploymentType;
  isGeneric: boolean;
  directoryUrl: string;
  supportsOAuth2: boolean;
}
