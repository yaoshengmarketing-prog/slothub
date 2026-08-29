---
name: slot-hub-guide-content
description: Run the approved Slot Hub Guide content workflow for Guide topic selection, briefs, drafting, source validation, structured relationships, published simulation, review, and Preview publishing. Do not use for general website articles, game-data intake, or non-Slot Hub projects.
---

# Slot Hub Guide Content

Use this skill only for Slot Hub Guide work: topic selection, readonly Briefs, Guide drafts, source review, structured Guide/Game relationships, simulated publishing, human review, or approved Preview publishing.

## Required authorities

Before taking task actions, read these files completely from the repository root:

1. `slothub-site/docs/slot-hub-master-blueprint-v1.md`
2. `slothub-site/docs/guide-content-workflow-v1.md`

Treat the approved Guide Content Workflow as the single detailed procedure. Do not reproduce or improvise a parallel workflow. Follow any additional authority or relationship specification that the workflow routes to. If an authority is missing or conflicts with the repository state or current user authorization, stop at the workflow's appropriate blocker state and report the discrepancy.

## Execution invariants

- Identify the current workflow state and the actions explicitly authorized for this task. Automatically continue only across states that do not require human approval and remain within the authorized file and action scope.
- Preserve every human gate in the workflow. This skill does not grant permission to select a new topic, change Schema, taxonomy, resolver or URL behavior, transfer ownership from an existing published Guide, change `draft` to `published`, Commit, Push, deploy, or alter production-domain and indexing settings.
- When a new Guide takes ownership of an existing Deferred Mechanism, Feature, or Data Topic, inspect relationship tests, relationship UI tests, and Search/Explorer expectations for stale Deferred assumptions. Preserve expectations for concepts that remain deferred.
- During `RELATIONSHIP_PREVIEW_REVIEW`, keep the Guide temporarily `published` while running the same complete command as CI from `slothub-site/`. Use equivalent environment-variable syntax for the current shell, but always set `ASTRO_TELEMETRY_DISABLED=1` and `PUBLIC_SITE_ENV=preview`, then run `npm run verify`. For Windows PowerShell:

  ```powershell
  $env:ASTRO_TELEMETRY_DISABLED='1'
  $env:PUBLIC_SITE_ENV='preview'
  npm run verify
  ```

  Restore `status: draft` only after the complete command and required UI checks pass. Never Commit the temporary published state.
- Enter `PUBLISHED_TO_PREVIEW` only when GitHub Actions completes successfully, Cloudflare Pages deploys successfully, and the Deployment SHA matches the approved publishing Commit. All three conditions are required.
- If CI reveals a source, content, relationship/Search/Explorer ownership, or UI problem, enter the corresponding RETURN state from the workflow. Do not continue merely because Cloudflare has already deployed. Treat Node, permission, remote-conflict, and indeterminate infrastructure failures as `BLOCKED` unless the workflow explicitly permits a safe wait or retry.
- Use the repository's existing validation commands. Do not add helper scripts for this workflow.
- End every stage report with every fixed field required by `guide-content-workflow-v1.md`; use `N/A` rather than omitting fields.

## Exclusions

Do not apply this skill to ordinary website articles outside the Slot Hub Guide collection, Provider or Game intake, game candidate validation, general website engineering, or other projects.
