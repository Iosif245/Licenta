import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IReportResponse, { IReportsListResponse } from '@app/types/report/IReportResponse';

// API Request Functions

/**
 * Get report by ID
 */
export const getReportByIdRequest = async (id: string): Promise<Partial<IReportResponse>> => {
  const response: AxiosResponse<IReportResponse> = await getApi().get(`/api/reports/${id}`);
  return response.data;
};

/**
 * Get list of reports with pagination and filtering
 */
export const getReportsRequest = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  type?: string;
  status?: string;
  priority?: string;
  targetType?: string;
  reporterId?: string;
  assignedToId?: string;
}): Promise<Partial<IReportsListResponse>> => {
  const response: AxiosResponse<IReportsListResponse> = await getApi().get('/api/reports', { params });
  return response.data;
};

/**
 * Create a new report
 */
export const createReportRequest = async (data: {
  title: string;
  description: string;
  category: string;
  type: string;
  priority: string;
  targetId: string;
  targetType: string;
  attachments?: File[];
}): Promise<{ id: string }> => {
  const formData = new FormData();

  // Append text fields
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('type', data.type);
  formData.append('priority', data.priority);
  formData.append('targetId', data.targetId);
  formData.append('targetType', data.targetType);

  // Append attachment files
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Update report
 */
export const updateReportRequest = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    type?: string;
    status?: string;
    priority?: string;
    assignedToId?: string;
    resolution?: string;
  },
): Promise<void> => {
  await getApi().put(`/api/reports/${id}`, data);
};

/**
 * Delete report
 */
export const deleteReportRequest = async (id: string): Promise<void> => {
  await getApi().delete(`/api/reports/${id}`);
};

/**
 * Get reports by target
 */
export const getReportsByTargetRequest = async (
  targetId: string,
  targetType: string,
  params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  },
): Promise<Partial<IReportsListResponse>> => {
  const queryParams = { targetId, targetType, ...params };
  const response: AxiosResponse<IReportsListResponse> = await getApi().get('/api/reports/target', { params: queryParams });
  return response.data;
};

/**
 * Get reports by user
 */
export const getReportsByUserRequest = async (
  userId: string,
  params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  },
): Promise<Partial<IReportsListResponse>> => {
  const response: AxiosResponse<IReportsListResponse> = await getApi().get(`/api/reports/user/${userId}`, { params });
  return response.data;
};

/**
 * Assign report to user
 */
export const assignReportRequest = async (reportId: string, assignedToId: string): Promise<void> => {
  await getApi().put(`/api/reports/${reportId}/assign`, { assignedToId });
};

/**
 * Update report status
 */
export const updateReportStatusRequest = async (reportId: string, status: string, resolution?: string): Promise<void> => {
  await getApi().put(`/api/reports/${reportId}/status`, { status, resolution });
};
