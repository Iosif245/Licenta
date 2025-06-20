import { AxiosResponse } from 'axios';
import { getApi } from '../index';
import IAssociationResponse, { IAssociationSummaryResponse } from '@app/types/association/IAssociationResponse';

// API Request Functions

/**
 * Get association by ID
 */
export const getAssociationByIdRequest = async (id: string): Promise<Partial<IAssociationResponse>> => {
  const response: AxiosResponse<IAssociationResponse> = await getApi().get(`/api/associations/${id}`);
  return response.data;
};

/**
 * Get association by ID or slug (unified lookup)
 * Backend now supports both ID and slug lookup via /api/associations/{identifier}
 */
export const getAssociationRequest = async (identifier: string): Promise<Partial<IAssociationResponse>> => {
  const response: AxiosResponse<IAssociationResponse> = await getApi().get(`/api/associations/${identifier}`);
  return response.data;
};

/**
 * Get list of associations (backend returns simple array, not paginated)
 */
export const getAssociationsRequest = async (): Promise<IAssociationSummaryResponse[]> => {
  console.log('🌐 Making API request to /api/associations');
  const response: AxiosResponse<IAssociationSummaryResponse[]> = await getApi().get('/api/associations');
  console.log('🌐 API Response status:', response.status);
  console.log('🌐 API Response data:', response.data);
  return response.data;
};

/**
 * Get paginated list of associations
 */
export const getAssociationsPagedRequest = async (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<{
  items: IAssociationSummaryResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}> => {
  const response = await getApi().get('/api/associations/paged', { params });
  return response.data;
};

/**
 * Create a new association
 */
export const createAssociationRequest = async (data: any): Promise<{ id: string }> => {
  const payload = {
    userId: data.userId,
    name: data.name,
    slug: data.slug,
    description: data.description,
    logo: data.logo,
    coverImage: data.coverImage,
    category: data.category,
    foundedYear: data.foundedYear,
    email: data.email,
    location: data.location,
    website: data.website,
    phone: data.phone,
    address: data.address,
    facebook: data.facebook,
    twitter: data.twitter,
    instagram: data.instagram,
    linkedIn: data.linkedIn,
    tags: data.tags || [],
  };

  const response: AxiosResponse<{ id: string }> = await getApi().post('/api/associations', payload);
  return response.data;
};

/**
 * Update association profile
 */
export const updateAssociationRequest = async (id: string, data: any): Promise<void> => {
  const formData = new FormData();

  // Append text fields (only if provided)
  if (data.name) formData.append('name', data.name);
  if (data.slug) formData.append('slug', data.slug);
  if (data.description) formData.append('description', data.description);
  if (data.category) formData.append('category', data.category);
  if (data.foundedYear) formData.append('foundedYear', data.foundedYear.toString());
  if (data.email) formData.append('email', data.email);
  if (data.location !== undefined) formData.append('location', data.location || '');
  if (data.website !== undefined) formData.append('website', data.website || '');
  if (data.phone !== undefined) formData.append('phone', data.phone || '');
  if (data.address !== undefined) formData.append('address', data.address || '');
  if (data.facebook !== undefined) formData.append('facebook', data.facebook || '');
  if (data.twitter !== undefined) formData.append('twitter', data.twitter || '');
  if (data.instagram !== undefined) formData.append('instagram', data.instagram || '');
  if (data.linkedIn !== undefined) formData.append('linkedIn', data.linkedIn || '');

  // Append arrays as JSON
  if (data.tags) {
    formData.append('tags', JSON.stringify(data.tags));
  }

  // Append image files if provided
  if (data.logo) formData.append('logo', data.logo);
  if (data.coverImage) formData.append('coverImage', data.coverImage);

  await getApi().put(`/api/associations/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Delete association
 */
export const deleteAssociationRequest = async (id: string): Promise<void> => {
  await getApi().delete(`/api/associations/${id}`);
};

// Note: The following endpoints are not yet implemented in the backend:
// - Search associations (/api/associations/search)
// - Featured associations (/api/associations/featured)
// - Associations by category (/api/associations/category/{category})
// - Update logo only (/api/associations/{id}/logo)
// - Update cover image only (/api/associations/{id}/cover)
//
// These would need to be implemented in the backend if needed.
// For now, filtering can be done client-side on the full list.
