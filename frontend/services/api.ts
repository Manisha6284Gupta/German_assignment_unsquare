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
  role: 'advisor' | 'client';
  dealId?: string;
  roleTitle?: string;
  subdomain?: string;
  brokerageName?: string;
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

    const data = await res.json();
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
      const data = await res.json();
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
    const data = await res.json();
    return data.data;
  },

  async updateDealStage(dealId: string, stage: Deal['stage']): Promise<Deal> {
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    });
    const data = await res.json();
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
    return res.json();
  },

  async getDealDocuments(dealId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/documents`);
    return res.json();
  },

  // Demo
  async requestDemo(payload: DemoRequestPayload): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/demo/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Auth & Multi-Role
  login: loginApi,

  async register(userData: { name: string; email: string; role?: UserRole; password?: string; brokerageName?: string; subdomain?: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async updateUserRole(payload: { email?: string; userId?: string; newRole: UserRole }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/update-role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async convertToClient(payload: { dealId: string; clientName: string; email?: string }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/auth/convert-to-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
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
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to provision brokerage workspace');
    }
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
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create user account');
    }
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
    const data = await res.json();
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
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update user profile');
    }
    return data;
  },

  // Health
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  }
};

export default api;
