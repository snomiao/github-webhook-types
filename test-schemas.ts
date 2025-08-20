import type { components } from "@octokit/openapi-types";
import type { WEBHOOK_EVENTS } from "./src/index.js";

type S = components["schemas"];

// Check what keys exist for project-related schemas
type ProjectKeys = Extract<keyof S, `webhook-project${string}`>;
type ProjectCardKeys = Extract<keyof S, `webhook-project-card${string}`>;

// Test our new patterns
type NewProjectPattern = ("webhook-project" | `webhook-project-${string}`) & keyof S;
type NewProjectCardPattern = ("webhook-project-card" | `webhook-project-card-${string}`) & keyof S;

// Test if they're different now
type ProjectType = S[NewProjectPattern];
type ProjectCardType = S[NewProjectCardPattern];

// Export for inspection
export type {
  ProjectKeys,
  ProjectCardKeys,
  NewProjectPattern,
  NewProjectCardPattern,
  ProjectType,
  ProjectCardType,
  WEBHOOK_EVENTS
};

// Test actual usage
const test: WEBHOOK_EVENTS["project"] = {} as any;
const testCard: WEBHOOK_EVENTS["project_card"] = {} as any;

console.log("Schema check file created successfully");