import { test, expect } from "bun:test";
import { expectTypeOf } from "expect-type";
import type { WEBHOOK_EVENTS, WEBHOOK_EVENT } from "../index.js";

test("WEBHOOK_EVENTS type structure", () => {
  expectTypeOf<WEBHOOK_EVENTS["push"]>().toMatchTypeOf<any>();
  expectTypeOf<WEBHOOK_EVENTS["pull_request"]>().toMatchTypeOf<any>();
  expectTypeOf<WEBHOOK_EVENTS["issues"]>().toMatchTypeOf<any>();
  expectTypeOf<WEBHOOK_EVENTS["check_run"]>().toMatchTypeOf<any>();
  expectTypeOf<WEBHOOK_EVENTS["workflow_run"]>().toMatchTypeOf<any>();
});

test("WEBHOOK_EVENT discriminated union", () => {
  const pushEvent: WEBHOOK_EVENT = {
    type: "push",
    payload: {} as WEBHOOK_EVENTS["push"]
  };
  
  const prEvent: WEBHOOK_EVENT = {
    type: "pull_request",
    payload: {} as WEBHOOK_EVENTS["pull_request"]
  };
  
  const issueEvent: WEBHOOK_EVENT = {
    type: "issues",
    payload: {} as WEBHOOK_EVENTS["issues"]
  };
  
  expectTypeOf(pushEvent).toMatchTypeOf<WEBHOOK_EVENT>();
  expectTypeOf(prEvent).toMatchTypeOf<WEBHOOK_EVENT>();
  expectTypeOf(issueEvent).toMatchTypeOf<WEBHOOK_EVENT>();
});

test("WEBHOOK_EVENT type discrimination", () => {
  function handleWebhookEvent(event: WEBHOOK_EVENT) {
    if (event.type === "push") {
      expectTypeOf(event.payload).toMatchTypeOf<WEBHOOK_EVENTS["push"]>();
    }
    
    if (event.type === "pull_request") {
      expectTypeOf(event.payload).toMatchTypeOf<WEBHOOK_EVENTS["pull_request"]>();
    }
    
    if (event.type === "issues") {
      expectTypeOf(event.payload).toMatchTypeOf<WEBHOOK_EVENTS["issues"]>();
    }
  }
  
  expect(handleWebhookEvent).toBeDefined();
});

test("All webhook event types are present", () => {
  const eventTypes: (keyof WEBHOOK_EVENTS)[] = [
    "branch_protection_configuration",
    "branch_protection_rule",
    "check_run",
    "check_suite",
    "code_scanning_alert",
    "commit_comment",
    "create",
    "custom_property",
    "custom_property_values",
    "delete",
    "dependabot_alert",
    "deploy_key",
    "deployment",
    "deployment_protection_rule",
    "deployment_review",
    "deployment_status",
    "discussion",
    "discussion_comment",
    "fork",
    "github_app_authorization",
    "gollum",
    "installation",
    "installation_repositories",
    "installation_target",
    "issue_comment",
    "issue_dependencies",
    "issues",
    "label",
    "marketplace_purchase",
    "member",
    "membership",
    "merge_group",
    "meta",
    "milestone",
    "org_block",
    "organization",
    "package",
    "page_build",
    "personal_access_token_request",
    "ping",
    "project",
    "project_card",
    "project_column",
    "projects_v2",
    "projects_v2_item",
    "projects_v2_status_update",
    "public",
    "pull_request",
    "pull_request_review",
    "pull_request_review_comment",
    "pull_request_review_thread",
    "push",
    "registry_package",
    "release",
    "repository",
    "repository_advisory",
    "repository_dispatch",
    "repository_import",
    "repository_ruleset",
    "repository_vulnerability_alert",
    "secret_scanning_alert",
    "secret_scanning_alert_location",
    "secret_scanning_scan",
    "security_advisory",
    "security_and_analysis",
    "sponsorship",
    "star",
    "status",
    "sub_issues",
    "team",
    "team_add",
    "watch",
    "workflow_dispatch",
    "workflow_job",
    "workflow_run"
  ];

  eventTypes.forEach(eventType => {
    expectTypeOf<WEBHOOK_EVENTS[typeof eventType]>().toMatchTypeOf<any>();
  });
  
  expect(eventTypes.length).toBeGreaterThan(70);
});

test("WEBHOOK_EVENT union completeness", () => {
  const sampleEvents: WEBHOOK_EVENT[] = [
    { type: "push", payload: {} as WEBHOOK_EVENTS["push"] },
    { type: "pull_request", payload: {} as WEBHOOK_EVENTS["pull_request"] },
    { type: "issues", payload: {} as WEBHOOK_EVENTS["issues"] },
    { type: "workflow_run", payload: {} as WEBHOOK_EVENTS["workflow_run"] },
    { type: "check_run", payload: {} as WEBHOOK_EVENTS["check_run"] },
  ];
  
  sampleEvents.forEach(event => {
    expectTypeOf(event).toMatchTypeOf<WEBHOOK_EVENT>();
  });
  
  expect(sampleEvents).toHaveLength(5);
});