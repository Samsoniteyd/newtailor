export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormProps {
  isLogin: boolean;
  initialData?: {
    email?: string;
    password?: string;
    phone?: string;
  };
  onSubmit: (data: { email: string; password: string; phone?: string }) => void;
}

export interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Requisition {
  _id: string;
  user: string | User;
  name: string;
  description?: string;
  measurements: {
    chest?: number;
    shoulders?: number;
    sleeveLengthLong?: number;
    sleeveLengthShort?: number;
    topLength?: number;
    neck?: number;
    tommy?: number;
    hip?: number;
    waist?: number;
    length?: number;
    lap?: number;
    base?: number;
    agbadaLength?: number;
    agbadaSleeve?: number;
  };
  contactInfo: {
    phone?: string;
    email?: string;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  completedDate?: string;
  notes: Array<{
    text: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequisitionData {
  name: string;
  description?: string;
  measurements?: {
    chest?: number;
    shoulders?: number;
    sleeveLengthLong?: number;
    sleeveLengthShort?: number;
    topLength?: number;
    neck?: number;
    tommy?: number;
    hip?: number;
    waist?: number;
    length?: number;
    lap?: number;
    base?: number;
    agbadaLength?: number;
    agbadaSleeve?: number;
  };
  contactInfo: {
    phone?: string;
    email?: string;
  };
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  results?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface RequisitionQuery {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  sort?: string;
}