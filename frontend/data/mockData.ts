import { Deal, Brokerage, PricingPlan } from '../types';

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'DEAL-8491',
    clientName: 'Alexander & Maya Lindqvist',
    clientType: 'Expat (EU Blue Card)',
    nationality: 'Sweden / UK',
    propertyCity: 'Munich (Schwabing)',
    propertyPrice: 850000,
    loanAmount: 680000,
    equityPercent: 20,
    stage: 'doc_verification',
    assignedBroker: 'Maximilian Bauer',
    avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    schufaScore: 98.4,
    monthlyNetIncome: 9400,
    targetBank: 'ING-DiBa',
    matchScore: 96,
    docsReady: 4,
    totalDocs: 5,
    createdAt: '2 hours ago',
    priority: 'high'
  },
  {
    id: 'DEAL-8492',
    clientName: 'Priya Narang & Dev Patel',
    clientType: 'Expat (EU Blue Card)',
    nationality: 'India',
    propertyCity: 'Berlin (Prenzlauer Berg)',
    propertyPrice: 620000,
    loanAmount: 520000,
    equityPercent: 16,
    stage: 'bank_matching',
    assignedBroker: 'Laura Weimann',
    avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
    schufaScore: 99.1,
    monthlyNetIncome: 8800,
    targetBank: 'Commerzbank / DKB',
    matchScore: 94,
    docsReady: 5,
    totalDocs: 5,
    createdAt: 'Yesterday',
    priority: 'urgent'
  },
  {
    id: 'DEAL-8493',
    clientName: 'Dr. Florian & Sophie Richter',
    clientType: 'German Resident',
    nationality: 'Germany',
    propertyCity: 'Frankfurt (Westend)',
    propertyPrice: 1250000,
    loanAmount: 950000,
    equityPercent: 24,
    stage: 'offer_issued',
    assignedBroker: 'Maximilian Bauer',
    avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg',
    schufaScore: 99.7,
    monthlyNetIncome: 14200,
    targetBank: 'Sparkasse Frankfurt',
    matchScore: 98,
    docsReady: 6,
    totalDocs: 6,
    createdAt: '3 days ago',
    priority: 'urgent'
  },
  {
    id: 'DEAL-8494',
    clientName: 'Lucas & Camille Dubois',
    clientType: 'Expat (EU Blue Card)',
    nationality: 'France',
    propertyCity: 'Hamburg (Eppendorf)',
    propertyPrice: 740000,
    loanAmount: 590000,
    equityPercent: 20,
    stage: 'new_lead',
    assignedBroker: 'Jonas Keller',
    avatar: '/frontend/assets/images/avatar_mern_developer_1790659832213.jpg',
    schufaScore: 97.8,
    monthlyNetIncome: 7900,
    targetBank: 'Santander Consumer Bank',
    matchScore: 91,
    docsReady: 1,
    totalDocs: 5,
    createdAt: '15 mins ago',
    priority: 'medium'
  },
  {
    id: 'DEAL-8495',
    clientName: 'Stefan & Katharina Weber',
    clientType: 'Freelancer / Self-Employed',
    nationality: 'Germany / Austria',
    propertyCity: 'Stuttgart (Degerloch)',
    propertyPrice: 890000,
    loanAmount: 650000,
    equityPercent: 27,
    stage: 'new_lead',
    assignedBroker: 'Laura Weimann',
    avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg',
    schufaScore: 98.2,
    monthlyNetIncome: 11000,
    targetBank: 'HypoVereinsbank',
    matchScore: 89,
    docsReady: 2,
    totalDocs: 6,
    createdAt: '45 mins ago',
    priority: 'high'
  },
  {
    id: 'DEAL-8496',
    clientName: 'Elena Volkov & Mark Taylor',
    clientType: 'Non-EU Permanent',
    nationality: 'Canada',
    propertyCity: 'Cologne (Lindenthal)',
    propertyPrice: 580000,
    loanAmount: 460000,
    equityPercent: 21,
    stage: 'closed_won',
    assignedBroker: 'Jonas Keller',
    avatar: '/frontend/assets/images/avatar_mern_developer_1790659832213.jpg',
    schufaScore: 99.4,
    monthlyNetIncome: 8200,
    targetBank: 'Münchener Hypothekenbank',
    matchScore: 99,
    docsReady: 5,
    totalDocs: 5,
    createdAt: '1 week ago',
    priority: 'medium'
  }
];

export const TRUSTED_BROKERAGES: Brokerage[] = [
  {
    name: 'Bavaria FinOps Partners',
    location: 'Munich',
    logoText: 'BAVARIA HYPOTHEKEN',
    metrics: '€180M+ Annual Volume'
  },
  {
    name: 'Berlin Expat Home Loans',
    location: 'Berlin',
    logoText: 'EXPAT LENDING BERLIN',
    metrics: '94% Expat Approval Rate'
  },
  {
    name: 'Frankfurt Prime Financial',
    location: 'Frankfurt am Main',
    logoText: 'FRANKFURT PRIME',
    metrics: '1,400+ Closed Mortgages'
  },
  {
    name: 'Rhein-Ruhr Baufinanzierung',
    location: 'Düsseldorf / Köln',
    logoText: 'RHEIN-RUHR HYP',
    metrics: '12 Days Avg. Bank Approval'
  },
  {
    name: 'Hanseatic Mortgage Advisory',
    location: 'Hamburg',
    logoText: 'HANSEATIC IMMO',
    metrics: '4.9/5 TrustScore'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Independent Advisor',
    description: 'Perfect for solo German mortgage brokers managing up to 20 active deals simultaneously.',
    priceMonthly: 149,
    priceAnnual: 119,
    features: [
      '1 Broker Seat included',
      'Up to 25 Active Client Pipelines',
      'Expat Lead Capture Webforms',
      'German Document Vault & Checklist',
      'Email & WhatsApp Notification Triggers',
      'Basic Schufa & Net Income Scorer',
      'Standard EU GDPR & BaFin Compliance',
      'Community & Email Support'
    ],
    cta: 'Start 14-Day Free Trial'
  },
  {
    id: 'pro',
    name: 'Pro Brokerage Team',
    description: 'Designed for expanding mortgage brokerages scaling expat and domestic volume.',
    priceMonthly: 349,
    priceAnnual: 279,
    popular: true,
    features: [
      '5 Broker Seats included (+€49/seat)',
      'Unlimited Active Pipelines & Deals',
      'AI OCR Extraction (Gehaltsabrechnung / Steuer)',
      'Multi-Language Expat Intake Portal',
      'Europace & Bank API Pre-check Bridge',
      'Automated Bank Submission PDF Packager',
      'Multi-advisor Round-Robin Lead Routing',
      'Dedicated Customer Success & German SLA'
    ],
    cta: 'Claim Pro Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Multi-Tenant',
    description: 'For nationwide mortgage franchises, aggregator networks, and fintech lending platforms.',
    priceMonthly: 799,
    priceAnnual: 639,
    features: [
      'Unlimited Broker & Admin Seats',
      'Custom White-label Tenant Subdomains',
      'Full BaFin Audit Trail & Data Isolation',
      'Custom Core-Banking & CRM Webhooks',
      'Dedicated Frankfurt Cloud Instance (ISO 27001)',
      'Custom Workflow Automations & Role RBAC',
      'Priority 24/7 Phone & Slack Support',
      'Custom Broker Onboarding & Training'
    ],
    cta: 'Schedule Enterprise Discovery'
  }
];

export const TESTIMONIALS = [
  {
    quote: "Handling expat clients in Germany used to mean endless email chains explaining why a German Blue Card needs specific banking documents. LeadFlow automated our intake in 4 languages and cut our time-to-offer from 21 days down to 6 days.",
    author: "Maximilian Bauer",
    role: "Managing Partner",
    company: "Bavaria FinOps GmbH, Munich",
    volume: "€42M Loan Volume (2025)",
    avatar: '/frontend/assets/images/avatar_team_lead_1790659845812.jpg'
  },
  {
    quote: "The document verification engine alone saved our team over 20 hours every week. German banks like ING and Commerzbank praise the structured PDF submission packages generated by LeadFlow CRM.",
    author: "Laura Weimann",
    role: "Senior Mortgage Advisor",
    company: "Berlin Expat Lending Group",
    volume: "180+ Expat Families Housed",
    avatar: '/frontend/assets/images/avatar_product_manager_1790659859501.jpg'
  },
  {
    quote: "With strict BaFin regulations and GDPR requirements in Germany, having true multi-tenant data isolation and Frankfurt-hosted servers gave our bank partners 100% confidence.",
    author: "Jonas Keller",
    role: "Head of Digital Broking",
    company: "Frankfurt Prime Mortgage Partners",
    volume: "€65M Financed",
    avatar: '/frontend/assets/images/avatar_mern_developer_1790659832213.jpg'
  }
];
