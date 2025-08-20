import type { components } from "@octokit/openapi-types";

type S = components["schemas"];

// Test the exact patterns we're using
type ProjectPattern = ("webhook-project" | `webhook-project-${string}`) & keyof S;
type ProjectCardPattern = ("webhook-project-card" | `webhook-project-card-${string}`) & keyof S;

// What keys actually match?
type ProjectMatches = ProjectPattern;
type ProjectCardMatches = ProjectCardPattern;

// Extract all webhook-project related keys
type AllProjectKeys = Extract<keyof S, `webhook-project${string}`>;

// The issue: let's see what TypeScript thinks these resolve to
type ProjectSchema = S[ProjectPattern];
type ProjectCardSchema = S[ProjectCardPattern];

// Test if they're the same (they should be different)
type AreSame = ProjectSchema extends ProjectCardSchema 
  ? ProjectCardSchema extends ProjectSchema 
    ? true 
    : false 
  : false;

// Export for debugging
export type DebugInfo = {
  ProjectMatches: ProjectMatches;
  ProjectCardMatches: ProjectCardMatches;
  AllProjectKeys: AllProjectKeys;
  AreSame: AreSame;
};

// Manual test - these should work and be different types
const projectEvent: ProjectSchema = {} as any;
const projectCardEvent: ProjectCardSchema = {} as any;

export { projectEvent, projectCardEvent };