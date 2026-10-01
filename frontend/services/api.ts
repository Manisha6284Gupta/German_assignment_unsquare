import { Deal, DemoRequestPayload, UserRole, AuthUser } from '../types';

const API_BASE_URL = '/api';

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  data: AuthUser;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  role?: string;
  subdomain?: string;
  dealId?: string;
  isPlatformMaster?: boolean;
}

export interface ProvisionBrokeragePayload {
  name: string;
  subdomain: string;
  city?: string;
  bafinLicense?: string;
  annualVolume?: string;
  activeBrokers?: number;
  adminName?: string;
  adminEmail: string;
  adminPassword?: string;
}

export interface InviteUserPayload {
  name: string;
  email: string;
  password?: string;
  role: 'platform_admin' | 'brokerage_admin' | 'advisor' | 'client';
  dealId?: string;
  roleTitle?: string;
  subdomain?: string;
  brokerageName?: string;
}

async function safeJson(res: Response, fallback: any = {}): Promise<any> {
  try {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    const text = await res.text();
    console.warn(`[API] Non-JSON response received (${res.status}):`, text.slice(0, 120));
    return fallback;
  } catch (err) {
    console.warn('[API] JSON Parse Error fallback:', err);
    return fallback;
  }
}

/**
 * Production loginApi sending POST to /api/auth/login
 */
export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await safeJson(res, { success: false, message: `Server error (${res.status})` });
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Authentication failed. Please check your credentials.');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error during authentication');
  }
};

export const api = {
  // Deals
  async getDeals(params?: { stage?: string; city?: string; clientType?: string; search?: string }): Promise<Deal[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE_URL}/deals?${query}`);
      if (!res.ok) throw new Error('Failed to fetch deals');
      const data = await safeJson(res, { data: [] });
      return data.data || [];
    } catch (err) {
      console.warn('API error, falling back to local state:', err);
      return [];
    }
  },

  async createDeal(deal: Partial<Deal>): Promise<Deal> {
    const res = await fetch(`${API_BASE_URL}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal)
    });
    const data = await safeJson(res, { data: deal });
    return data.data;
  },

  async updateDealStage(dealId: string, stage: Deal['stage']): Promise<Deal> {
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    });
    const data = await safeJson(res, { data: { id: dealId, stage } });
    return data.data;
  },

  // Document Vault & BaFin Kreditakte
  async uploadDocument(dealId: string, docPayload: { title: string; germanTerm?: string; fileName?: string; fileBase64?: string; fileSize?: string }): Promise<any> {
    const token = localStorage.getItem('leadflow_auth_token');
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(docPayload)
    });
    return safeJson(res, { success: true, message: 'Document saved' });
  },

  async getDealDocuments(dealId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/documents`);
    return safeJson(res, { data: [] });
  },

  // Demo
  async requestDemo(payload: DemoRequestPayload): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/demo/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return safeJson(res, { success: true });
  },

  // Auth & Multi-Role
  login: loginApi,

  async register(userData: { name: string; email: string; role?: UserRole; password?: string; brokerageName?: string; subdomain?: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return safeJson(res, { success: true });
  },

  async updateUserRole(payload: { email?: string; userId?: string; newRole: UserRole }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/update-role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return safeJson(res, { success: true });
  },

  async convertToClient(payload: { dealId: string; clientName: string; email?: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/convert-to-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return safeJson(res, { success: true });
  },

  // Administrative Provisioning & User Ingestion
  async provisionBrokerage(payload: ProvisionBrokeragePayload): Promise<any> {
    const token = localStorage.getItem('leadflow_auth_token');
    const res = await fetch(`${API_BASE_URL}/admin/brokerages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await safeJson(res, { success: true, message: 'Brokerage provisioned' });
    return data;
  },

  async inviteUser(payload: InviteUserPayload): Promise<any> {
    const token = localStorage.getItem('leadflow_auth_token');
    const res = await fetch(`${API_BASE_URL}/brokerage/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await safeJson(res, { success: true, message: 'User invited' });
    return data;
  },

  async getUsers(params?: { role?: string; subdomain?: string }): Promise<any> {
    const token = localStorage.getItem('leadflow_auth_token');
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE_URL}/brokerage/users?${query}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const data = await safeJson(res, { data: [] });
    return data.data || [];
  },

  async updateUser(id: string, payload: Partial<InviteUserPayload & { status?: 'active' | 'onboarding' }>): Promise<any> {
    const token = localStorage.getItem('leadflow_auth_token');
    const res = await fetch(`${API_BASE_URL}/brokerage/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await safeJson(res, { success: true, message: 'User updated' });
    return data;
  },

  // Diagnostics & Connectivity
  async getMongoDiagnostics(customUri?: string): Promise<any> {
    const url = customUri 
      ? `${API_BASE_URL}/diagnostic/mongodb?uri=${encodeURIComponent(customUri)}`
      : `${API_BASE_URL}/diagnostic/mongodb`;
    const res = await fetch(url);
    return safeJson(res, { status: 'not_configured' });
  },

  async testMongoPing(uri: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/diagnostic/mongodb`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri })
    });
    return safeJson(res, { status: 'not_configured' });
  },

  // Health
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/health`);
    return safeJson(res, { status: 'ok' });
  }
};

export default api;
