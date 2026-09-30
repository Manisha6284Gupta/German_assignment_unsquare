# LeadFlow CRM 🇩🇪
### The All-in-One CRM & Pipeline Infrastructure for German Mortgage Brokers (§ 34i GewO)

> **Streamline Your Mortgage Business: From Expat Lead to Homeowner, Faster.**  
> Automate multilingual expat lead capture, verify German income & tax documents with DATEV OCR, and dispatch bank-ready dossiers across nationwide German lending networks.

---

## 🚀 Key Capabilities

- 🌐 **Multilingual Expat Lead Capture**: Intelligent intake forms in English, German, French, Spanish, Hindi, and Mandarin. Pre-qualifies EU Blue Card holders, permanent residents, and self-employed borrowers with automatic residency permit checks.
- 📑 **German Document Vault & DATEV OCR**: Automated extraction and validation of 3-month salary slips (*Gehaltsabrechnung*), annual tax certificates (*Lohnsteuerbescheinigung*), and credit bureau reports (*Schufa Bonitätsauskunft*).
- 📊 **Interactive 5-Stage Kanban Pipeline**: Dynamic deal tracking across *New Leads*, *Doc Verification*, *Bank Matching (Europace)*, *Offer Issued*, and *Closed Won (Notary Done)*.
- 🧮 **Broker Commission & ROI Calculator**: Real-time revenue modeling based on loan volumes, deal closures, and bank commission provision rates (benchmarking time and fee upside).
- 🏦 **Direct German Bank Dispatcher**: Instant multi-bank condition comparisons (ING-DiBa, Commerzbank, DKB, Sparkassen, Volksbanken) and integrated KfW subsidy calculations (KfW 124, 261, 300).
- 🔒 **Enterprise Multi-Tenant Security**: Full cryptographic tenant isolation per brokerage, Frankfurt ISO 27001 data residency, DSGVO / EU GDPR compliance, and immutable BaFin audit trails.

---

## 🛠️ Architecture & Tech Stack

```text
├── backend/                      # Node.js & Express REST API Server
│   ├── config/
│   │   └── db.js                 # In-memory MongoDB engine with query filters & indexing
│   ├── controllers/
│   │   ├── dealController.js     # Mortgage pipeline CRUD & Kanban stage advancement
│   │   ├── authController.js     # Brokerage user auth & tenant RBAC
│   │   ├── demoController.js     # Broker demo requests & sandbox scheduling
│   │   └── calculatorController.js # German mortgage commission & ROI calculations
│   ├── middleware/
│   │   ├── authMiddleware.js     # Bearer token validation & tenant scoping
│   │   └── errorMiddleware.js    # Centralized HTTP error handling
│   ├── models/
│   │   ├── Deal.js               # Borrower mortgage inquiry schema
│   │   ├── User.js               # Broker advisor accounts
│   │   ├── Document.js           # OCR verification records & document checklist
│   │   └── Brokerage.js          # Multi-tenant workspace configuration
│   ├── routes/                   # Express routes (/api/deals, /api/auth, /api/demo, /api/calculator)
│   └── server.js                 # Express application router export
│
├── frontend/                     # React 19 Single Page Application (SPA)
│   ├── assets/images/            # Team avatars and visual assets
│   ├── components/
│   │   ├── Navbar.tsx            # Wordmark, navigation, and primary actions
│   │   ├── Hero.tsx              # Vector UI preview with live pipeline switcher
│   │   ├── FeatureCardsRow.tsx   # 4 core feature cards
│   │   ├── InteractivePipeline.tsx # 5-stage live Kanban board with filters
│   │   ├── BrokerCalculator.tsx  # Interactive volume & commission calculator
│   │   ├── DeepDiveFeatures.tsx  # Tabbed German market capability deep dive
│   │   ├── ForBrokers.tsx        # Direct comparison table vs. generic CRMs
│   │   ├── TrustSection.tsx      # Brokerage partners, trust badges, testimonials
│   │   ├── Pricing.tsx           # Monthly & annual subscription plans
│   │   ├── DemoModal.tsx         # Custom 1-on-1 demo booking dialog
│   │   ├── LoginModal.tsx        # Multi-tenant workspace sign-in
│   │   ├── DossierModal.tsx      # Comprehensive client Kreditakte inspector
│   │   ├── AddLeadModal.tsx      # Custom borrower simulation modal
│   │   └── Footer.tsx            # Secondary CTA & German legal compliance footer
│   ├── data/
│   │   └── mockData.ts           # Initial sample deals, brokerages, and pricing
│   ├── services/
│   │   └── api.ts                # REST API client connecting to /api
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── App.tsx                   # Main React root application
│   ├── index.css                 # Tailwind CSS & custom typography
│   └── main.tsx                  # Client DOM mounting
│
├── index.html                    # Root HTML entry point (loads /frontend/main.tsx)
├── server.ts                     # Root full-stack server (serves /api & frontend on Port 3000)
└── package.json                  # Dependencies & build scripts
```

### Technology Highlights:
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, In-Memory MongoDB engine with collection querying
- **Hosting & Port**: Unified single-port deployment on `http://0.0.0.0:3000`

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Dev Server
```bash
npm run dev
```
> The application will be running at `http://localhost:3000`. Both backend API routes (`/api/*`) and the frontend UI are served simultaneously.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/deals` | Retrieve pipeline deals (supports `?stage=`, `?city=`, `?search=`) |
| `POST` | `/api/deals` | Register a new borrower mortgage inquiry |
| `PATCH` | `/api/deals/:id/stage` | Advance a deal to the next pipeline stage |
| `POST` | `/api/demo/request` | Submit a request for a custom brokerage walkthrough |
| `POST` | `/api/calculator/roi` | Calculate broker gross provisions and admin hours saved |
| `POST` | `/api/auth/login` | Authenticate advisor with tenant workspace |
| `GET` | `/api/health` | Server & database diagnostic status |

---

## 🏛️ Regulatory & Compliance Standards

- **§ 34i GewO**: Built specifically for licensed German real estate loan brokers (*Immobiliardarlehensvermittler*).
- **BaFin Compliant**: Immutable audit trail for all document access, verification steps, and bank submissions.
- **DSGVO / EU GDPR**: Data processed strictly within EU/Frankfurt data centers with 256-bit AES encryption at rest and TLS 1.3 in transit.

---



## 📄 License
Copyright © 2026 LeadFlow CRM Technologies GmbH. All rights reserved.
