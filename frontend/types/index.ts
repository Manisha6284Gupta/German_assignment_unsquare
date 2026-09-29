export interface Deal {
  id: string;
  clientName: string;
  clientType: 'Expat (EU Blue Card)' | 'German Resident' | 'Non-EU Permanent' | 'Freelancer / Self-Employed';
  nationality: string;
  propertyCity: string;
  propertyPrice: number;
  loanAmount: number;
  equityPercent: number;
  stage: 'new_lead' | 'doc_verification' | 'bank_matching' | 'offer_issued' | 'closed_won';
  assignedBroker: string;
  avatar: string;
  schufaScore: number;
  monthlyNetIncome: number;
  targetBank: string;
  matchScore: number;
  docsReady: number;
  totalDocs: number;
  createdAt: string;
  priority: 'urgent' | 'high' | 'medium';
}

export interface Brokerage {
  name: string;
  location: string;
  logoText: string;
  metrics: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  popular?: boolean;
  features: string[];
  cta: string;
}

export interface DemoRequestPayload {
  name: string;
  email: string;
  brokerageName?: string;
  phone?: string;
  city?: string;
  monthlyVolume?: string;
  teamSize?: string;
}

export type UserRole = 'platform_admin' | 'brokerage_admin' | 'advisor' | 'client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  brokerageId?: string;
  brokerageName?: string;
  subdomain?: string;
  avatar?: string;
  dealId?: string; // For client portal
  token?: string;
}

export interface TenantBrokerage {
  id: string;
  name: string;
  subdomain: string;
  city: string;
  adminName: string;
  adminEmail: string;
  advisorCount: number;
  monthlyVolume: string;
  status: 'active' | 'provisioning' | 'trial';
  bafinLicense: string;
  dealsCount: number;
}

