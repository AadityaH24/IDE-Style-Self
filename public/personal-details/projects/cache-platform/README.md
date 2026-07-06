# Cache Operations Platform

## Overview

Designed and built an enterprise platform to orchestrate cache invalidation and content delivery workflows across AEM, Akamai Edge, NetStorage, and Dispatcher infrastructure. The platform enables engineering and content teams to safely execute cache operations at scale through policy-driven governance, intelligent execution strategies, and automated recovery.

## Key Capabilities

- Self-service dashboard for cache operations
- Sitemap-based URL discovery and selective cache invalidation
- Bulk cache requests through Excel imports
- Multi-domain and multi-site cache management
- Automatic resolution of vanity URLs to dispatcher cache paths
- Intelligent routing between Akamai purge and NetStorage deployment
- Dispatcher cache warm-up to minimize origin traffic after invalidation
- Rule-based governance with graded approval workflows
- Email approvals with one-click approve/reject actions
- Origin health gates preventing unsafe production operations
- Safe retries with complete audit history
- Elasticsearch indexing and New Relic observability

## Integrations

- Adobe Experience Manager (AEM)
- Akamai Edge
- Akamai NetStorage
- Elasticsearch
- New Relic
- AWS Lambda
- Step Functions
- SQS

## Architecture

```
User
   │
   ▼
Cache Operations Dashboard
   │
   ▼
Governance Engine
   │
   ├── Approval Workflow
   ├── Policy Validation
   ├── Health Gates
   ▼
Execution Engine
   │
   ├── Dispatcher Warm-up
   ├── NetStorage Upload
   ├── Akamai Purge
   └── Safe Retries
   ▼
Monitoring & Audit
```

## Highlights

- Automated enterprise cache operations across multiple production domains
- Reduced manual deployment effort through intelligent workflows
- Protected origin infrastructure using health-aware execution
- Standardized cache management through reusable operational tooling
- Built as a scalable, event-driven platform integrating multiple enterprise systems
