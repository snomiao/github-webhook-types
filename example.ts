import type { WEBHOOK_EVENT, WEBHOOK_EVENTS } from './src/index.js';

// Example 1: Handle specific webhook events
function handlePushEvent(event: WEBHOOK_EVENTS['push']) {
  console.log(`Push to ${event.repository.full_name}`);
  console.log(`Commits: ${event.commits.length}`);
  console.log(`Branch: ${event.ref}`);

  event.commits.forEach(commit => {
    console.log(`- ${commit.message} by ${commit.author.name}`);
  });
}

function handlePullRequestEvent(event: WEBHOOK_EVENTS['pull_request']) {
  console.log(`PR ${event.action}: ${event.pull_request.title}`);
  console.log(`From: ${event.pull_request.head.ref} -> ${event.pull_request.base.ref}`);
  console.log(`Author: ${event.pull_request.user?.login || 'Unknown'}`);
  console.log(`Repository: ${event.repository.full_name}`);
}

function handleIssuesEvent(event: WEBHOOK_EVENTS['issues']) {
  console.log(`Issue ${event.action}: ${event.issue.title}`);
  console.log(`Number: #${event.issue.number}`);
  console.log(`Author: ${event.issue.user?.login || 'Unknown'}`);
  console.log(`Repository: ${event.repository.full_name}`);
}

// Example 2: Generic webhook handler using discriminated union
function handleWebhookEvent(event: WEBHOOK_EVENT) {
  switch (event.type) {
    case 'push':
      handlePushEvent(event.payload);
      break;

    case 'pull_request':
      handlePullRequestEvent(event.payload);
      break;

    case 'issues':
      handleIssuesEvent(event.payload);
      break;

    case 'workflow_run':
      console.log(`Workflow ${event.payload.action}: ${event.payload.workflow_run.name}`);
      console.log(`Status: ${event.payload.workflow_run.status}`);
      console.log(`Conclusion: ${event.payload.workflow_run.conclusion}`);
      break;

    case 'check_run':
      console.log(`Check run ${event.payload.action || 'unknown'}: ${event.payload.check_run?.name || 'unknown'}`);
      console.log(`Status: ${event.payload.check_run?.status || 'unknown'}`);
      console.log(`Conclusion: ${event.payload.check_run?.conclusion || 'none'}`);
      break;

    case 'release':
      console.log(`Release ${event.payload.action}: ${event.payload.release.tag_name}`);
      console.log(`Name: ${event.payload.release.name}`);
      console.log(`Published: ${event.payload.release.published_at}`);
      break;

    case 'star':
      console.log(`Repository ${event.payload.action === 'created' ? 'starred' : 'unstarred'}`);
      console.log(`By: ${event.payload.sender.login}`);
      console.log(`Repository: ${event.payload.repository.full_name}`);
      break;

    case 'fork':
      console.log(`Repository forked: ${event.payload.forkee.full_name}`);
      console.log(`By: ${event.payload.sender.login}`);
      console.log(`From: ${event.payload.repository.full_name}`);
      break;

    default:
      // TypeScript ensures exhaustiveness - this should never be reached
      console.log(`Unhandled webhook event type: ${(event as any).type}`);
  }
}

// Example 3: Express.js-style webhook handler
function webhookHandler(req: { body: WEBHOOK_EVENT }) {
  const event = req.body;

  try {
    handleWebhookEvent(event);
    console.log(`Successfully processed ${event.type} event`);
  } catch (error) {
    console.error(`Error processing ${event.type} event:`, error);
    throw error;
  }
}

// Example 4: Type-safe webhook server with Bun
function createWebhookServer() {
  return Bun.serve({
    port: 3000,
    async fetch(req) {
      if (req.method === 'POST' && req.url === '/webhook') {
        try {
          const event = await req.json() as WEBHOOK_EVENT;
          handleWebhookEvent(event);
          return new Response('OK', { status: 200 });
        } catch (error) {
          console.error('Webhook error:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }

      return new Response('Not Found', { status: 404 });
    }
  });
}

// Example usage:
// const server = createWebhookServer();
// console.log(`Webhook server running on port ${server.port}`);

export {
  handleWebhookEvent,
  handlePushEvent,
  handlePullRequestEvent,
  handleIssuesEvent,
  webhookHandler,
  createWebhookServer
};