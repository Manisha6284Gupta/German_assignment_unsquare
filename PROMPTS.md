# LeadFlow CRM 🚀

> **Multi-Tenant CRM & Client Portal Engine for Mortgage Brokerages**  
> Built with Next.js, TypeScript, Node.js, and MongoDB / Prisma.

---

## 📌 Project Overview

**LeadFlow CRM** is a full-stack multi-tenant platform designed specifically for mortgage and financial brokerages. It provides end-to-end management of client acquisition, automated lead ingestion, real-time pipeline collaboration, asynchronous document verification, and stage-based workflow automation—all while strictly isolating data across individual brokerage tenants.

---

## ✨ Key Features

### 🏢 Multi-Tenancy & Security
* **Tenant Data Isolation:** Serve multiple brokerage client organizations from a single deployment. Every request and database query is scoped by `brokerageId` to guarantee strict data segregation.
* **Role-Based Access Control (RBAC):** Configured for 4 distinct user roles:
  * **Platform Admin:** Tenant onboarding, platform metrics, and system health monitoring.
  * **Brokerage Admin:** Team management, pipeline configuration, email templates, and trigger rules.
  * **Advisor:** Lead and client management, Kanban pipeline operations, document review, and task execution.
  * **Client:** Interactive portal access, active case status tracking, and secure document dossier uploads.

---

### 🔄 Ingestion & Live Workflows
* **Automated External Ingestion:** RESTful webhook endpoints to receive lead data automatically from external lead providers and landing pages.
* **Lead Deduplication Engine:** Pre-persists checks match incoming lead attributes (email, phone, national ID) against existing records under the target brokerage to prevent orphaned duplicates.
* **Collaborative Live Kanban Board:** Drag-and-drop pipeline interface (`New` → `Contacted` → `Qualified` → `Proposal` → `Won`/`Lost`) synced live across all active advisor screens via real-time WebSocket events.

---

### 📂 Dossier Verification & Automations
* **Client Self-Service Portal:** 1-click lead conversion into active Client accounts with secure login access and assigned case folders.
* **Asynchronous Dossier Queue:** Background job processing worker for uploaded client documents (IDs, payslips, bank statements) simulating verification latency and stochastic error states.
* **Automated Workflow Triggers:**
  * **Email Automations:** Dynamic HTML templates supporting placeholder tags (e.g., `{{client.name}}`, `{{advisor.name}}`) triggered automatically on stage entry.
  * **Task & SLA Triggers:** Auto-generate stage-linked actionable tasks with due dates, advisor assignments, and visual overdue flags.
* **Low-Latency Analytics:** Instant performance dashboard displaying pipeline volumes, conversion rates, and stage bottleneck metrics.

---

## 🛠️ System Architecture
