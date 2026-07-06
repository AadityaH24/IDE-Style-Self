# Architecture

## Event-Driven Cache Governance

```
URL Update → SQS Queue → Lambda (detect restricted content)
                           │
                           ▼
                    Step Function (approval workflow)
                           │
               ┌───────────┴───────────┐
               ▼                       ▼
          Auto-Approve          Email Notification
               │                       │
               ▼                       ▼
          Purge Cache          Await Manual Approval
                                       │
                                       ▼
                                  Purge Cache
```

## Components

- **Content Detector** — AWS Lambda that inspects URL categories and flags restricted content
- **Approval Orchestrator** — Step Function state machine managing approval branching
- **Notification Service** — Automated email notifications via SES with audit tracking
- **Cache Purge Executor** — Lambda integration with Akamai CCU API for cache invalidation

## Governance

- Restricted-content URL categories detected at ingestion time
- Approval-based workflows enforced via email-based approval loops
- Full audit trail for all purge operations
