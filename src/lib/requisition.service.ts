import api from './axios';
import { 
  Requisition, 
  CreateRequisitionData, 
  ApiResponse, 
  RequisitionQuery 
} from '../types';

class RequisitionService {
  // Get all requisitions
  async getRequisitions(params?: RequisitionQuery): Promise<Requisition[]> {
    const response = await api.get<ApiResponse<{ requisitions: Requisition[] }>>(
      '/requisitions',
      { params }
    );
    return response.data.data!.requisitions;
  }

  // Get single requisition
  async getRequisition(id: string): Promise<Requisition> {
    const response = await api.get<ApiResponse<{ requisition: Requisition }>>(
      `/requisitions/${id}`
    );
    return response.data.data!.requisition;
  }

  // Create requisition
  async createRequisition(data: CreateRequisitionData): Promise<Requisition> {
    const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
      '/requisitions',
      data
    );
    return response.data.data!.requisition;
  }

  // Update requisition
  async updateRequisition(id: string, data: Partial<CreateRequisitionData>): Promise<Requisition> {
    const response = await api.put<ApiResponse<{ requisition: Requisition }>>(
      `/requisitions/${id}`,
      data
    );
    return response.data.data!.requisition;
  }

  // Delete requisition
  async deleteRequisition(id: string): Promise<void> {
    await api.delete(`/requisitions/${id}`);
  }

  // Add note to requisition
  async addNote(id: string, note: string): Promise<Requisition> {
    const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
      `/requisitions/${id}/notes`,
      { text: note }
    );
    return response.data.data!.requisition;
  }
}

export default new RequisitionService(); 