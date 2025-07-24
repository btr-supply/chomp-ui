# Homepage Specification (`/`)

This document specifies the design and functionality of the main landing page for cho.mp.

## 1. Dynamic Hero Section

### Text Rotator
A first phrase (subtitle) that changes every 5 seconds:
- `Google indexes 5TB+ of new pages daily`
- `X users generate 500GB+ of tweets daily`
- `Blockchains grow by 500 GB daily`
- `Public APIs generate 1 TB daily`
- `The internet grows by 450 million TB daily`

A phrase that changes every 3.5 seconds to showcase different use cases:
- `let chomp isolate signal from noise`
- `let chomp make sense of it`
- `let chomp consolidate sources`
- `let chomp observe while you sleep`
- `let chomp aggregate price feeds`
- `let chomp forecast volatility`
- `let chomp power your AI agent`
- `let chomp handle your back-end`
- `let chomp monitor your homelab`
- `let chomp listen to on-chain events`
- `let chomp track your portfolio`
- `let chomp track your social media`
- `let chomp identify trends`
- `let chomp predict weather`
- `let chomp serve while you build`

**Visual**: The word "chomp" is highlighted in yellow (Modak font), rest in monospace (IBM Plex Mono).

## 2. The Problem

**Headline**: "Infrastructure cost cut 10x"

Don't trade performance for simplicity. Enterprise platforms are overkill for most use cases and require dedicated DevOps teams, while simple tools can't handle production workloads.
Chomp brings enterprise performance to hobby hardware.

## 3. Core Value Proposition

### Three Main Feature Cards

## 4. Production Ready

- **Universal**: Comptible with Web2 (HTTP, WebSockets, FIX...) and Web3 (EVM, SVM, Sui...) data sources
- **No-Code**: Configure, deploy. Chomp ships your API, admin functions, and a polished UI.
- **Blazing**: Process millions of data points per day on low-end hardware (hundreds of millions with decent configuration)

--- More (eg. carousel of secondary features, hidden by a "Wow me more" button) ---
- **Lightweight**: The default back-end easily runs on low-end hardware (Raspberry Pi 4)
- **Scalable**: Most Chomp use cases can fit on a single decent configuration. But nodes can automatically spawn horizontally and adapt to your evolving data needs
- **Modular**: Don't like the default TDengine/Redis back-end? You can use any other, even your existing stack
- **Extensible**: Chomp is built on FastAPI. Extend it in minutes, make it your own back-end (this could be a whole section with code snippet in a future version)
- **Secure**: Configurable API endpoints and resource access, rate limits, authentication (Web3, OAuth2..., this could also be a whole section)
- **Observable**: Real-time interactive data visualization, cluster administration and more

---

**[Try cho.mp Now →](https://cho.mp)** | **[View Documentation →](https://cho.mp/docs)** | **[Source Code →](https://github.com/btr-supply/chomp)**

## 4. Configuration Showcase

### Split-Screen Demo Section

#### Left Panel: ingester configuration `cex-vs-dex.yml`

```yaml
# Test configuration mixing CEX API prices and EVM DEX prices
# Refer to ingester-config-schema.yml for reference
vars:
  _1: &price_ingester { resource_type: timeseries, type: float64, interval: s5 }
  _2: &curve_stable { selector: "get_dy(int128,int128,uint256)((uint256))", tags: ["DEX", "Curve", "Stable", "CFMM"]}
  _3: &uni_v3 { selector: "slot0()((uint160,int24,uint16,uint16,uint16,uint8,bool))", tags: ["DEX", "Uniswap", "v3", "CLMM"]}

# CEXs
http_api:
  - name: BinanceFeeds
    <<: *price_ingester
    tags: ["CEX", "Order Book", "CLOB", "Binance"]
    target: https://api.binance.com/api/v3/ticker/price
    pre_transformer: |
      def t(ticker_data: dict):
        prices = {}
        for item in ticker_data:
          prices[item['symbol']] = float(item.get('price') or 0)
        return prices
    transformers: ["{self} * {USDT}", "round4"] # rebase to USDC
    fields:
      # stables
      - {name: USDT, selector: .USDCUSDT, transformers: ["1 / {self}", "round6"]}
      # flagships
      - {name: BTC, selector: .BTCUSDT}
      - {name: ETH, selector: .ETHUSDT}

# Ethereum DEXs
evm_caller:
  - name: EthereumFeeds
    <<: *price_ingester
    fields:
      # stables
      - {name: USDT.1, <<: *curve_stable, target: "1:0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7", params: [2,1,1_000_000], transformers: ["{self}[0] / 1e6", "round6"], transient: true}
      # flagships
      - {name: ETH.1, <<: *uni_v3, target: "1:0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", transformers: ["2 ** 192 / {self}[0] ** 2 * 1e12", "round4"], transient: true}
      - {name: ETH.2, <<: *uni_v3, target: "1:0x4e68ccd3e89f51c3074ca5072bbac773960dfa36", transformers: ["{self}[0] ** 2 / 2 ** 192 * 1e12 * {USDT.1}", "round4"], transient: true}
      - {name: ETH, transformers: ["({ETH.1} + {ETH.2}) / 2", "round2"]}
      - {name: WBTC.1, <<: *uni_v3, target: "1:0x4585fe77225b41b697c938b018e2ac67ac5a20c0", transformers: ["{self}[0] ** 2 / 2 ** 192 / 1e10 * {ETH.1}", "round4"], transient: true}
      - {name: WBTC.2, <<: *uni_v3, target: "1:0xcbcdf9626bc03e24f779434178a73a0b4bad62ed", transformers: ["{self}[0] ** 2 / 2 ** 192 / 1e10 * {ETH.1}", "round4"], transient: true}
      - {name: BTC, transformers: ["({WBTC.1} + {WBTC.2}) / 2", "round2"], tags: ["DEX", "Multiple", "Index"]}

```

#### Right Panel: API served, real-time and historical data (3 tabs)

##### Tab 1: Schema
```json
{
  "BinanceFeeds":
    {
      "name": "BinanceFeeds",
      "type": "timeseries",
      "protected": false,
      "fields":
        {
          "ts":
            {
              "type": "timestamp",
              "target": "https://api.binance.com/api/v3/ticker/price",
              "tags": ["CEX", "Order Book", "CLOB"],
            },
          "USDT":
            {
              "type": "float64",
              "target": "https://api.binance.com/api/v3/ticker/price",
              "tags": ["CEX", "Order Book", "CLOB"],
            },
          "BTC":
            {
              "type": "float64",
              "target": "https://api.binance.com/api/v3/ticker/price",
              "tags": ["CEX", "Order Book", "CLOB"],
            },
          "ETH":
            {
              "type": "float64",
              "target": "https://api.binance.com/api/v3/ticker/price",
              "tags": ["CEX", "Order Book", "CLOB"],
            },
        },
    },
  "EthereumFeeds":
    {
      "name": "EthereumFeeds",
      "type": "timeseries",
      "protected": false,
      "fields":
        {
          "ts":
            {
              "type": "timestamp",
              "target": "",
              "tags": [],
            },
          "ETH":
            {
              "type": "float64",
              "target": "1:0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
              "tags": ["DEX", "Uniswap", "v3", "CLMM"],
            },
          "BTC":
            {
              "type": "float64",
              "target": "1:0x4585fe77225b41b697c938b018e2ac67ac5a20c0",
              "tags": ["DEX", "Multiple", "Index"],
            },
        },
    },
}
```

##### Tab 2: Last Values (Active by default)
```json
// curl localhost:40004/last/BinanceFeeds,EthereumFeeds
{
    "BinanceFeeds": {
        "USDT": 1.0001, // USDT/USDC
        "ETH": 2253.57, // ETH/USDC
        "BTC": 101923.05, // BTC/USDC
        "date": "2025-06-23T06:27:00+00:00"
    },
    "EthereumFeeds": {
        "USDT": 1.00003, // USDT/USDC, Curve stableswap pool price
        "ETH": 2251.88, // ETH/USDC, average of the two most active Uniswap V3 pools
        "WBTC": 101922.10, // BTC/USDC, average of the two most active Uniswap V3 pools
        "date": "2025-06-23T06:27:00+00:00"
    },
}
```

##### Tab 3: Historical Data
// curl localhost:40004/history/BinanceFeeds,EthereumFeeds?interval=m15&from_date=2025-06-01
```json
{
    "columns": [ "ts", "BinanceFeeds.USDT", "BinanceFeeds.ETH", "BinanceFeeds.BTC", "EthereumFeeds.USDT", "EthereumFeeds.ETH", "EthereumFeeds.BTC"], // column names
    "types": [ "int64", "float64", "float64", "float64", "float64", "float64", "float64"], // data types
    "data": [ (48)[…], (48)[…], (48)[…], (48)[…], (48)[…], (48)[…], (48)[…]] // columnar data
}
```

**Caption**: "From configuration to production API in minutes. Check it out in real-time: https://cho.mp"

## 5. Performance Metrics

### Uncompromised Performance

**Chomp inherits blazing performance from its dual-engine architecture**: Redis powers lightning-fast caching and cluster synchronization, while TDengine delivers high-compression time-series storage.

| Hardware Tier | Daily Throughput | Memory | CPU | Use Case |
|---------------|------------------|---------|-----|-----------|
| **Raspberry Pi 4** | **1-20M data points** | 2GB | 4 vCPU | IoT, homelab, small projects |
| **Mid-range Server** | **20-500M data points** | 6GB | 8 vCPU | Most Production workloads |
| **High-end Config** | **500M+ data points** | 12GB+ | 12+ vCPU | Top 1% Enterprise scale |

**Scaling Architecture**:
- **Vertical**: Multi-threaded nodes elastically consume resources
- **Horizontal**: Automatic cluster synchronization prevents resource competition

*Sources: [Redis Benchmarks](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/), [Azure Cache Performance](https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices-performance?tabs=redis), [TDengine Performance](https://tdengine.com/high-performance/), [IoT Database Comparison](https://tdengine.com/iot-performance-comparison-influxdb-and-timescaledb-vs-tdengine/)

## 6. Architecture Overview

### Cluster Architecture Diagram

**Visual representation showing**:
- **Database Node**: 1 TDengine instance (storage/indexing) + 1 Redis instance (caching/synchronization)
- **N Ingester Nodes**: Configurable data collection workers
- **1 API Node**: RESTful interface for data access
- **Decoupled UI**: Accessible at cho.mp or self-hosted

**Caption**: "Default cluster setup requires only 2GB RAM and 2 vCPU. Nodes automatically synchronize via Redis to prevent resource competition."

**Low-Code Core**: YAML-configured ETL pipelines that deploy quickly.

**Backend Independence**: Complete decoupling with dynamic discovery, per-backend auth, and graceful fallback handling.

**Performance Foundation**: Redis for caching and cluster coordination, TDengine for high-speed time-series storage (replaceable with TimescaleDB, InfluxDB, QuestDB).

## 7. Comprehensive FAQ

### Getting Started

**Q: What data sources does Chomp support?**
A: Chomp handles both Web2 and Web3 data sources:
- **Web2**: Dynamic web scraping, HTTP API calls, WebSocket events, FIX API events
- **Web3**: EVM (Ethereum & chains), SVM (Solana & chains), Sui, and more planned: storage calls, event logs indexing

**Q: What's the minimum required configuration?**
A: The default cluster setup (TDengine+Redis backend, at least 1 ingester node and 1 API node) requires 2GB RAM and 2 vCPU (minimum 2GFLOPS). This is highly dependent on workload and ingestion frequency. Recommended setup is 4GB RAM and 3 vCPU for medium workloads (10 resources, 10 fields each, every 10 seconds). If experiencing lags, review server bandwidth, CPU saturation, disable monitoring, or increase ingestion intervals. NB: Server push/pub events can be more resource-heavy, so low-end configurations are discouraged for WebSocket/FIX APIs and Web3 event logs indexing.

### Performance & Scaling

**Q: What's the minimum collection interval?**
A: No minimum for server push/pub events (WebSocket/FIX APIs, Web3 events). 1-second intervals for client calls (most use cases do not require sub-second recurrent pull data ingestion).

**Q: Can a Chomp cluster scale?**
A: Yes, with diagonal scaling:
- **Vertically**: The multi-threaded nature of each ingestion node makes it elastic in resource consumption, therefore a single node can handle a fair amount of resource ingestion (most setups can be handled by a single node)
- **Horizontally**: For HA setups and more elastic node management (not locking instance resources), cluster nodes synchronize by default to prevent workload competition

### Database & API Support

**Q: What authentication methods are supported?**
A: Chomp supports multiple authentication methods:
- **Static Tokens**: Admin access tokens for API authentication
- **Web3 Wallets**: EVM (Ethereum & chains), SVM (Solana & chains), Sui signature-based auth
- **OAuth2**: GitHub, Twitter/X (available for self-hosted deployments only, not cho.mp due to callback URL requirements)

**Q: What databases does Chomp support?**
A: Chomp is modular and supports multiple time-series databases:
- **Default**: TDengine (high-compression, optimized for IoT-scale data)
- **Alternatives**: TimescaleDB, InfluxDB, QuestDB, and other time-series databases
- **Custom**: Add your own database adapter via PR to [GitHub adapters](https://github.com/btr-supply/chomp/tree/main/src/adapters)

**Q: Does Chomp provide RESTful or GraphQL APIs?**
A: Currently only RESTful APIs are implemented. GraphQL is not supported as our columnar data structure is optimized for REST-style queries rather than graph relationships.

### Deployment & Hosting

**Q: Do you provide 1-click cloud hosted instances?**
A: Yes, we provide cloud instances on demand. Contact us for dedicated hosted deployments, though cho.mp already provides instant access to public instances.

**Q: Will Chomp ever become a paid service?**
A: No. Chomp is and will remain under MIT license. Our business model relies on cloud instances and our own commercial use—the core platform stays free and open source.

### Technical Concerns

**Q: Is Chomp adapted for high-frequency trading (HFT) or MEV use cases requiring <50ms response times?**
A: In its current form, no. Chomp is designed for scale and general indexing but won't win the sub-second ETL-to-action race. For such use cases, a Rust port with in-memory kdb/kx backend replacing TDengine would be needed, but this would require significant rework.

**Q: Can I add custom database adapters?**
A: Yes! Open a PR on the codebase at [/src/adapters](https://github.com/btr-supply/chomp/tree/main/src/adapters) to contribute new database integrations.

**Q: Can I add new ingester types for unsupported blockchains or data sources?**
A: Absolutely! Open a PR on the codebase at [/src/ingesters](https://github.com/btr-supply/chomp/tree/main/src/ingesters) to add support for new protocols or data sources.

**Q: How does Chomp compare to Ponder.sh and The Graph?**
A: Ponder and The Graph specialize in EVM indexing and do really well at these (support for block reorganization, historical indexing, etc.). We share Ponder's ethos: lower the entry cost for any protocol/team/individual to own, index and manage their data. But we're taking things further by merging on-chain and off-chain data sources. For EVM-only data indexing, we recommend Ponder mainly, but users can also check out The Graph (thegraph.com), SQD (sqd.ai), or Envio (envio.dev). NB: Envio also provides high-performance read-only RPC endpoints at `https://<evmChainId>.rpc.hypersync.xyz/<api-token>` that can be used with Chomp for fast EVM caller and EVM logger ingestion.

**Q: Won't I get banned or throttled by APIs?**
A: You indeed may be banned or throttled. The use of Chomp should be responsible: make sure to use API keys if required on the services you ingest data from, or use other methods like rotating proxies to avoid such limitations. You can also simply increase your ingestion interval. This applies to both Web2 and Web3 data sources, since rate limits apply to all. The use of paid RPC provider endpoints is recommended for Web3 event logs ingestion, since these are reliable and few free tier RPC providers are compatible with the related methods.

**Q: How does Chomp handle data privacy and compliance?**
A: Since Chomp is self-hosted, you maintain full control over your data. All processing happens on your infrastructure, ensuring compliance with data privacy regulations. The cho.mp hosted UI only connects to your backends—it doesn't store your data.

**[Read Full Documentation →](https://cho.mp/docs)**

## 8. Get Started

**Ready to process millions of data points on minimal hardware?**

Three deployment options:

1. **[Try cho.mp Now →](https://cho.mp)** - Start immediately with hosted UI
2. **[View Documentation →](https://cho.mp/docs)** - Complete setup guides
3. **[Source Code →](https://github.com/btr-supply/chomp)** - Self-host and extend

---

**Technical Details**: Static site, mobile-responsive, fast loading with minimal JavaScript and optimized bundle size.
