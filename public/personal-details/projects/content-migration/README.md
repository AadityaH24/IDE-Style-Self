# Content Migration Engine

Designed and developed a configuration-driven migration platform to migrate content from AEM to CF360 at enterprise scale. Rather than building one-off migration scripts, the platform used runtime-selectable JSON configuration files to support different page structures, templates, and component mappings across multiple migrations.

## My Ownership

- End-to-end backend architecture
- AWS Lambda orchestration
- Amazon SQS integration
- AWS Step Functions workflow
- Amazon S3 configuration management
- Migration APIs
- Transformation engine
- Status tracking
- Cloud configuration (excluding VPN/security provisioning handled by DevOps)

## Key Engineering Decisions

### Configuration-driven migrations

Migration rules were stored as JSON configuration files in S3 and selected during migration startup.

This allowed:

- Different migrations to reuse the same engine
- Support for multiple page structures
- Support for different template mappings
- Reduced need for code changes

### Transformation Engine

Handled:

- Field mapping
- Component ID mapping
- Nested list transformations
- Rich text conversion
- Page/component relationship mapping
- Rule-based template detection

### Scale

- 120,000+ pages
- 98 component types
- Batch-based migration pipeline

### Reliability

Implemented:

- Automatic retries for transient failures
- Identification and tracking of non-retryable pages
- Error reporting throughout migration lifecycle

### Controlled Ingestion

Used Step Functions specifically for page ingestion because CF360 could not be overwhelmed.

The workflow:

- Push a batch
- Wait
- Check CF360 health
- Continue only when healthy
- Retry automatically if required

This is a nice architectural decision because it shows you chose the right tool instead of putting everything into Step Functions.

### Status Tracking

Tracked progress across every migration stage.

Examples include:

- AEM extraction started
- AEM extraction completed
- Components transformed
- Components pushed
- Components reviewed
- Pages transformed
- Pages ingested
- Failure state with detailed errors

This gave business users visibility into long-running migrations.
