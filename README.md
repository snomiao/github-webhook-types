# GitHub Webhook Types

⚠️ **DEPRECATED**: This package is deprecated. Please use [`@octokit/webhooks-types`](https://www.npmjs.com/package/@octokit/webhooks-types) instead.

## Migration Guide

Instead of:
```bash
bun install github-webhook-types
```

Use:
```bash
bun install @octokit/webhooks-types
```

Instead of:
```typescript
import type { WEBHOOK_EVENT, WEBHOOK_EVENTS } from 'github-webhook-types';
```

Use:
```typescript
import type { WebhookEvent } from '@octokit/webhooks-types';
```

The official `@octokit/webhooks-types` package provides the same TypeScript types for GitHub webhook events with better maintenance and support.

---

**Legacy Documentation (Deprecated)**

TypeScript types for GitHub webhook events, providing comprehensive type safety for all GitHub webhook payloads.

## Features

- 🎯 **Type-safe**: Full TypeScript support for all GitHub webhook events
- 📦 **Zero-config**: Direct import and use
- 🔄 **Up-to-date**: Types are derived from GitHub's official OpenAPI specifications
- 🛡️ **Reliable**: Built on top of `@octokit/openapi-types`

## Installation

```bash
bun install github-webhook-types
```

## Usage

```typescript
import type { WEBHOOK_EVENT, WEBHOOK_EVENTS } from 'github-webhook-types';

// Handle a specific webhook event
function handlePushEvent(event: WEBHOOK_EVENTS['push']) {
  console.log(`Push to ${event.repository.full_name}`);
  console.log(`Commits: ${event.commits.length}`);
}

// Handle any webhook event with discriminated union
function handleWebhookEvent(event: WEBHOOK_EVENT) {
  switch (event.type) {
    case 'push':
      console.log(`Push event: ${event.payload.commits.length} commits`);
      break;
    case 'pull_request':
      console.log(`PR ${event.payload.action}: ${event.payload.pull_request.title}`);
      break;
    case 'issues':
      console.log(`Issue ${event.payload.action}: ${event.payload.issue.title}`);
      break;
    // ... handle other event types
  }
}
```

## Available Types

### `WEBHOOK_EVENTS`
An object type containing all GitHub webhook event payloads:

```typescript
type WEBHOOK_EVENTS = {
  branch_protection_configuration: /* ... */;
  branch_protection_rule: /* ... */;
  check_run: /* ... */;
  check_suite: /* ... */;
  code_scanning_alert: /* ... */;
  // ... all other webhook events
}
```

### `WEBHOOK_EVENT`
A discriminated union type for handling any webhook event:

```typescript
type WEBHOOK_EVENT = 
  | { type: "push"; payload: WEBHOOK_EVENTS["push"] }
  | { type: "pull_request"; payload: WEBHOOK_EVENTS["pull_request"] }
  | { type: "issues"; payload: WEBHOOK_EVENTS["issues"] }
  // ... all other webhook events
```

## Supported Events

This package includes types for all GitHub webhook events:

- **Repository events**: `push`, `create`, `delete`, `fork`, `public`, `repository`
- **Issue events**: `issues`, `issue_comment`
- **Pull Request events**: `pull_request`, `pull_request_review`, `pull_request_review_comment`
- **Check events**: `check_run`, `check_suite`
- **Workflow events**: `workflow_run`, `workflow_job`, `workflow_dispatch`
- **Security events**: `code_scanning_alert`, `secret_scanning_alert`, `dependabot_alert`
- **And many more...**

## Development

To install dependencies:

```bash
bun install
```

To run tests:

```bash
bun test
```

To build:

```bash
bun run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
