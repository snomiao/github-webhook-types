import type { WEBHOOK_EVENTS } from './src/index.js';

// Test that our specific types are properly resolved
type ProjectType = WEBHOOK_EVENTS['project'];
type ProjectCardType = WEBHOOK_EVENTS['project_card'];
type PullRequestType = WEBHOOK_EVENTS['pull_request'];
type PullRequestReviewType = WEBHOOK_EVENTS['pull_request_review'];

// These should all be valid object types, not never
const project: ProjectType = {} as any;
const projectCard: ProjectCardType = {} as any;
const pullRequest: PullRequestType = {} as any;
const pullRequestReview: PullRequestReviewType = {} as any;

// Test basic property access that was working before
console.log('Types resolved successfully');

export { project, projectCard, pullRequest, pullRequestReview };