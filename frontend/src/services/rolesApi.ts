import axios from 'axios';

const API = (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || 'http://localhost:3000')) + '/api';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface RoleView {
  role: string;
  status: 'ACTIVE' | 'PENDING' | 'AVAILABLE';
  assignedAt: string | null;
}

export interface MyRolesResponse {
  activeRole: string;
  roles: RoleView[];
}

export interface SwitchRoleResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export async function getMyRoles(): Promise<MyRolesResponse> {
  const res = await axios.get(`${API}/roles/my-roles`, { headers: authHeaders() });
  return res.data.data;
}

export async function requestRole(role: string): Promise<{ message: string }> {
  const res = await axios.post(`${API}/roles/request`, { role }, { headers: authHeaders() });
  return res.data;
}

export async function switchRole(role: string): Promise<SwitchRoleResponse> {
  const res = await axios.post(`${API}/roles/switch`, { role }, { headers: authHeaders() });
  return res.data.data;
}
