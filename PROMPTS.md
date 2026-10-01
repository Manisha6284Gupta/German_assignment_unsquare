# LeadFlow CRM — System Design & Master Execution Prompts

This document contains three distinct master prompts designed to architect, evaluate, and sequence the development of **LeadFlow CRM** using Next.js (App Router), TypeScript, Node.js, Prisma, and MongoDB.

---

## 1. How-To Master Prompt: Architecture, Engineering & Implementation

> **Goal:** Use this prompt to instruct an engineer or AI coding assistant (e.g., Cursor, Claude, ChatGPT) to generate the technical setup, schemas, API handlers, and UI modules for LeadFlow CRM.

text
Act as a Principal Software Architect. Design and engineer a multi-tenant CRM and Mortgage Client Portal named "LeadFlow CRM" using Next.js (App Router), TypeScript, Prisma, MongoDB, Tailwind CSS, and WebSockets/Pusher.

Ensure the implementation addresses the following three core technical pillars:

1. Core Architecture & Multi-Tenant Isolation
   - Multi-Tenant Data Isolation: Design a single deployment serving multiple brokerages where every database model and query automatically scopes by `brokerageId` to guarantee absolute data segregation.
   - Role-Based Access Control (RBAC): Implement strict RBAC across 4 distinct user roles:
     * Platform Admin: System-wide health, tenant provisioning, and global metrics.
     * Brokerage Admin: Organization setup, team roles, custom pipeline stages, email templates, and trigger rules.
     * Advisor: Lead/client management, Kanban drag-and-drop operations, task execution, and document reviews.
     * Client: Authenticated portal access, application status tracking, and dossier document uploads.

2. Lead Ingestion & Live Pipeline Engine
   - Automated Lead Ingestion: Create a public REST API route (`/api/v1/leads/ingest`) secured by tenant API keys to ingest leads from external sources (e.g., webhooks, landing pages).
   - Pre-Ingestion Deduplication: Implement matching logic checking email, phone number, or national ID against existing records within the target `brokerageId` before creating duplicates.
   - Live Collaborative Kanban Board: Build a real-time Kanban board (`New` → `Contacted` → `Qualified` → `Proposal` → `Won`/`Lost`) synced live across all active advisor sessions using WebSockets or Server-Sent Events (SSE).

3. Dossier Queue, Automations & Analytics
   - Client Portal Provisioning: Enable Advisors to convert qualified leads into active Client accounts with generated credentials and assigned case folders in 1 click.
   - Asynchronous Dossier Verification: Build a document upload portal integrated with a background worker queue (e.g., BullMQ / Redis or Upstash) that simulates verification delays (3–10s) and stochastic failure states (e.g., 15% failure rate for invalid uploads).
   - Workflow Automation Engine: Create HTML email templates supporting dynamic variable interpolation (e.g., `{{client.name}}`, `{{advisor.name}}`), automated stage-entry email triggers, and stage-linked task creation with due dates and visual overdue flags.
   - Low-Latency Analytics: Implement optimized database aggregation pipelines to render live pipeline volumes, conversion rates, and stage bottleneck metrics without stale data drift.
