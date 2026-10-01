# 🚀 LeadFlow CRM — Prompts

A curated collection of ** prompts** used to architect, build, debug, and deploy the full-stack **LeadFlow German Mortgage CRM** using **Node.js, Express, TypeScript, React 19, MongoDB Atlas, and Vercel**.

---

## 📑 Table of Contents
1. [Node.js ES Modules & `__dirname` Setup](#1-nodejs-es-modules--__dirname-setup)
2. [Express + Vite Development Server Integration](#2-express--vite-development-server-integration)
3. [Mongoose `CastError` on Custom String Deal IDs](#3-mongoose-casterror-on-custom-string-deal-ids)
4. [Vercel Serverless Function & HTML 404 Route Rewrites](#4-vercel-serverless-function--html-404-route-rewrites)
5. [Resilient MongoDB Atlas In-Memory Fallback](#5-resilient-mongodb-atlas-in-memory-fallback)
6. [JWT Authentication & Bearer Header Middleware](#6-jwt-authentication--bearer-header-middleware)
7. [Express Large Base64 File Uploads & SHA-256 Hashing](#7-express-large-base64-file-uploads--sha-256-hashing)
8. [Multi-Tenant Subdomain Routing Middleware](#8-multi-tenant-subdomain-routing-middleware)
9. [German Mortgage Tax & Annuity Calculation Engine](#9-german-mortgage-tax--annuity-calculation-engine)
10. [Simulating Asynchronous DATEV OCR Extraction](#10-simulating-asynchronous-datev-ocr-extraction)
11. [CORS Headers & Preflight `OPTIONS` Configuration](#11-cors-headers--preflight-options-configuration)
12. [Client-Side jsPDF Pre-Approval Letter Generator](#12-client-side-jspdf-pre-approval-letter-generator)
13. [Safe Frontend API Client with Non-JSON Protection](#13-safe-frontend-api-client-with-non-json-protection)
14. [Multi-Role Protected Route Guards in React](#14-multi-role-protected-route-guards-in-react)
15. [TypeScript Strict Build & Tailwind CSS v4 Configuration](#15-typescript-strict-build--tailwind-css-v4-configuration)

---

### 1. Node.js ES Modules & `__dirname` Setup
```markdown
I am getting "ReferenceError: __dirname is not defined in ES module scope" and 
"Cannot use import statement outside a module" in my Express server with `"type": "module"` 
in package.json. How do I properly set up fileURLToPath, import.meta.url, and configure 
Express to serve static assets and import local .js/.ts files without crashing?
```

---

### 2. Express + Vite Development Server Integration
```markdown
I want to run a single development server (`server.ts`) that serves both my Express 
REST API routes under `/api` and Vite's React frontend with HMR. When I import Vite in my 
server.ts, my API calls return `index.html` instead of JSON. How do I configure 
`createServer({ server: { middlewareMode: true } })` and write the route fallback so `/api` 
routes don't get swallowed by Vite's HTML handler?
```

---

### 3. Mongoose `CastError` on Custom String Deal IDs
```markdown
My MongoDB Mongoose schema throws "Cast to ObjectId failed for value 'DEAL-8491' at path 
'_id' for model 'Deal'" whenever I query by custom human-readable case references. How do 
I modify my Mongoose schema and router queries to support both native `_id` (ObjectId) and 
custom string identifiers like `dealId: "DEAL-8491"` without failing?
```

---

### 4. Vercel Serverless Function & HTML 404 Route Rewrites
```markdown
After deploying my Express app to Vercel as a serverless function in `api/index.ts`, my 
frontend fetch calls fail with "SyntaxError: Unexpected token '<', '<!DOCTYPE...' is not valid JSON". 
How do I configure `vercel.json` rewrites and write the Express handler so it matches routes 
whether Vercel keeps or strips the `/api` prefix?
```

---

### 5. Resilient MongoDB Atlas In-Memory Fallback
```markdown
When the `MONGODB_URI` environment variable is missing or the network connection to MongoDB 
Atlas times out, my Express server crashes on startup with `MongooseServerSelectionError`. 
How do I build an asynchronous database connection wrapper with auto-retry and a memory-buffered 
fallback so the app stays 100% functional even in offline/demo mode?
```

---

### 6. JWT Authentication & Bearer Header Middleware
```markdown
Write a robust Express auth middleware that extracts the Bearer token from the `Authorization` 
header, verifies it with `jsonwebtoken`, handles `TokenExpiredError` gracefully, and attaches 
the user payload (id, role, subdomain) to `req.user`. If no token is provided, return a 401 
JSON response instead of crashing the process.
```

---

### 7. Express Large Base64 File Uploads & SHA-256 Hashing
```markdown
When uploading scanned mortgage PDF documents in my React frontend, Express throws 
"PayloadTooLargeError: request entity too large (status 413)". How do I configure 
`express.json({ limit: '50mb' })` and `express.urlencoded({ limit: '50mb' })` in Node.js, and 
how do I compute a SHA-256 hash of the uploaded buffer using Node's crypto module for BaFin audit logs?
```

---

### 8. Multi-Tenant Subdomain Routing Middleware
```markdown
I need to detect the incoming tenant subdomain (e.g., "bavaria-finops.leadflowcrm.de") from 
`req.headers.host` in Express. How do I write a middleware that parses the subdomain, strips 
localhost/port, queries the Brokerage model in MongoDB, and scopes subsequent deal queries 
to that specific tenant?
```

---

### 9. German Mortgage Tax & Annuity Calculation Engine
```markdown
Create a pure JavaScript/TypeScript calculation utility in Express (`/api/calculator`) that takes 
`purchasePrice`, `downPayment`, and `federalState`. It should calculate Grunderwerbsteuer based on 
German state tax tables (e.g., Bavaria 3.5%, Berlin 6.0%), Notary fee (1.5%), Makler commission (3.57%), 
exact monthly annuity (Zins + Tilgung), and loan-to-value ratio (Beleihungsauslauf).
```

---

### 10. Simulating Asynchronous DATEV OCR Extraction
```markdown
I need a backend endpoint `POST /api/deals/:id/documents` that simulates asynchronous DATEV OCR 
parsing of German salary slips (Lohnabrechnung). How do I write an Express controller with a 2-second 
simulated delay that parses gross/net salary, validates BaFin § 34i compliance, updates the deal 
document array in MongoDB, and returns confidence scores?
```

---

### 11. CORS Headers & Preflight `OPTIONS` Configuration
```markdown
My React frontend on port 3000 throws "Access to fetch has been blocked by CORS policy: Response 
to preflight request doesn't pass access control check". How do I properly configure the `cors` 
package in Express to allow methods (GET, POST, PUT, PATCH, DELETE), headers (Content-Type, Authorization), 
and credentials across subdomains?
```

---

### 12. Client-Side jsPDF Pre-Approval Letter Generator
```markdown
When importing jsPDF in my React TypeScript component, Vite throws "ReferenceError: window is not 
defined" or build errors with dynamic imports. How do I build an official multi-page PDF generator 
(Finanzierungsbestätigung) using jsPDF with custom German fonts, table layout, letterheads, and a 
download trigger that works reliably in production?
```

---

### 13. Safe Frontend API Client with Non-JSON Protection
```markdown
In my React `api.ts` service, whenever a network error or 500 error occurs, calling `await res.json()` 
crashes the app with "Unexpected token 'T', 'The page c...' is not valid JSON". Write a safe wrapper 
function `safeJson(res, fallback)` that inspects the `Content-Type` header, logs the raw text on error, 
and returns a safe fallback object without crashing the UI.
```

---

### 14. Multi-Role Protected Route Guards in React
```markdown
How do I build a type-safe RoleGuard React component and AuthContext that checks `currentUser.role` 
(`platform_admin`, `brokerage_admin`, `advisor`, `client`) against allowed roles, prevents unauthorized 
access, and redirects unauthenticated users to the Login modal with a flash error notice?
```

---

### 15. TypeScript Strict Build & Tailwind CSS v4 Configuration
```markdown
My Vite build fails during `npm run build` with TypeScript type mismatch errors between React 19 types, 
Lucide icon components, and Express Request extensions. How do I configure `tsconfig.json` with `strict: true`, 
resolve ES module interop, and set up Tailwind CSS v4 using `@tailwindcss/vite` so everything compiles 
cleanly with 0 errors?
```

---

## 💻 Tech Stack Summary
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, jsPDF
* **Backend**: Node.js, Express.js (ES Modules), Mongoose, JWT, Bcrypt, CORS
* **Database**: MongoDB Atlas with in-memory resilient fallback
* **Deployment**: Vercel Serverless Functions + Vite Static Build
