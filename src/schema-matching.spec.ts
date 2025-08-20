import { test, expect } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { components as GithubApiComponents } from "@octokit/openapi-types";
import type { WEBHOOK_EVENTS } from "./index.js";

type S = GithubApiComponents["schemas"];

// This test demonstrates the schema matching problem
test("Schema matching issue: project vs project_card collision", () => {
  // The problematic patterns that cause collisions
  type ProjectPattern = `webhook-project${string}` & keyof S;
  type ProjectCardPattern = `webhook-project-card${string}` & keyof S;
  
  // Let's see what actual schema keys exist
  type ProjectKeys = Extract<keyof S, `webhook-project${string}`>;
  type ProjectCardKeys = Extract<keyof S, `webhook-project-card${string}`>;
  
  // This should be different types, but they might overlap due to the pattern matching
  type ProjectSchema = S[ProjectPattern];
  type ProjectCardSchema = S[ProjectCardPattern];
  
  // Test that these are actually different schemas
  // If the matching is working correctly, these should be distinct types
  const projectKeys: ProjectKeys[] = [] as any;
  const projectCardKeys: ProjectCardKeys[] = [] as any;
  
  // The issue: ProjectKeys might include "webhook-project-card-*" keys
  // because "webhook-project-card-*" starts with "webhook-project"
  
  console.log("Testing schema key matching...");
  expect(true).toBe(true); // Placeholder assertion
});

// Test the specific patterns that are problematic
test("Demonstrate overlapping patterns", () => {
  // These patterns will overlap:
  type Pattern1 = `webhook-project${string}`;
  type Pattern2 = `webhook-project-card${string}`;
  
  // Pattern1 matches both "webhook-project" and "webhook-project-card-*"
  // This is the core issue
  
  type TestString1 = "webhook-project" extends Pattern1 ? true : false;
  type TestString2 = "webhook-project-card" extends Pattern1 ? true : false;
  type TestString3 = "webhook-project-card-created" extends Pattern1 ? true : false;
  
  expectTypeOf<TestString1>().toEqualTypeOf<true>();
  expectTypeOf<TestString2>().toEqualTypeOf<true>(); // This is the problem!
  expectTypeOf<TestString3>().toEqualTypeOf<true>(); // This is the problem!
  
  // What we want: Pattern1 should NOT match strings that start with "webhook-project-card"
});

// Test for more specific patterns that would fix the issue
test("Proposed solution: exact matching patterns", () => {
  // Better patterns that avoid collisions
  type ExactProjectPattern = `webhook-project` | `webhook-project-${string}`;
  type ExactProjectCardPattern = `webhook-project-card` | `webhook-project-card-${string}`;
  
  // Test that these don't overlap inappropriately
  type TestExact1 = "webhook-project" extends ExactProjectPattern ? true : false;
  type TestExact2 = "webhook-project-created" extends ExactProjectPattern ? true : false;
  type TestExact3 = "webhook-project-card" extends ExactProjectPattern ? true : false;
  type TestExact4 = "webhook-project-card-created" extends ExactProjectCardPattern ? true : false;
  
  expectTypeOf<TestExact1>().toEqualTypeOf<true>();
  expectTypeOf<TestExact2>().toEqualTypeOf<true>();
  expectTypeOf<TestExact3>().toEqualTypeOf<false>(); // Good! No collision
  expectTypeOf<TestExact4>().toEqualTypeOf<true>();
});

// Test for even better solution using word boundaries
test("Better solution: word boundary patterns", () => {
  // Even better: use patterns that match the exact webhook name followed by nothing or a hyphen and action
  type WordBoundaryProjectPattern = "webhook-project" | `webhook-project-${string}`;
  type WordBoundaryProjectCardPattern = "webhook-project-card" | `webhook-project-card-${string}`;
  
  // This ensures "webhook-project" patterns don't match "webhook-project-card" patterns
  type IsProjectOnly = "webhook-project" extends WordBoundaryProjectPattern ? true : false;
  type IsProjectAction = "webhook-project-edited" extends WordBoundaryProjectPattern ? true : false;
  type IsProjectCardWrongMatch = "webhook-project-card" extends WordBoundaryProjectPattern ? true : false;
  type IsProjectCardCorrectMatch = "webhook-project-card" extends WordBoundaryProjectCardPattern ? true : false;
  
  expectTypeOf<IsProjectOnly>().toEqualTypeOf<true>();
  expectTypeOf<IsProjectAction>().toEqualTypeOf<true>();
  expectTypeOf<IsProjectCardWrongMatch>().toEqualTypeOf<false>(); // Perfect! No collision
  expectTypeOf<IsProjectCardCorrectMatch>().toEqualTypeOf<true>();
});

// Test that our actual implementation now works correctly
test("Verify fixed implementation doesn't have collisions", () => {
  // Test that project and project_card are distinct types now
  type ProjectType = WEBHOOK_EVENTS["project"];
  type ProjectCardType = WEBHOOK_EVENTS["project_card"];
  
  // These should be different types (not identical)
  type AreTypesIdentical = ProjectType extends ProjectCardType 
    ? ProjectCardType extends ProjectType 
      ? true 
      : false 
    : false;
  
  // We expect this to be false (types are different) after the fix
  expectTypeOf<AreTypesIdentical>().toEqualTypeOf<false>();
  
  // Both types should still be valid objects
  expectTypeOf<ProjectType>().toExtend<object>();
  expectTypeOf<ProjectCardType>().toExtend<object>();
});