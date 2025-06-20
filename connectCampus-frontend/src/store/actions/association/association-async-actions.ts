import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ASSOCIATION__GET_BY_ID, ASSOCIATION__GET_LIST, ASSOCIATION__CREATE, ASSOCIATION__UPDATE, ASSOCIATION__DELETE } from '@app/store/constants';
import ApiException from '@app/types/api/ApiException';
import {
  getAssociationByIdRequest,
  getAssociationRequest,
  getAssociationsRequest,
  getAssociationsPagedRequest,
  createAssociationRequest,
  updateAssociationRequest,
  deleteAssociationRequest,
} from '@app/api/requests/association-requests';
import alertService from '@app/services/alert';
import { setAssociationAction, setAssociationsListAction, setAssociationLoadingAction, removeAssociationFromListAction } from './association-sync-actions';

// Get association by ID
export const getAssociationByIdActionAsync = createAsyncThunk<any, string, { state: RootState }>(ASSOCIATION__GET_BY_ID, async (id, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    const response = await getAssociationByIdRequest(id);
    thunkApi.dispatch(setAssociationAction(response as any));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Get association by ID or slug (unified lookup)
export const getAssociationActionAsync = createAsyncThunk<any, string, { state: RootState }>('ASSOCIATION__GET', async (identifier, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    const response = await getAssociationRequest(identifier);
    thunkApi.dispatch(setAssociationAction(response as any));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Get associations list
export const getAssociationsActionAsync = createAsyncThunk<any, void, { state: RootState }>(ASSOCIATION__GET_LIST, async (_, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    console.log('🔄 Fetching associations from API...');
    const response = await getAssociationsRequest();
    console.log('✅ API Response received:', response);
    console.log('📊 Number of associations:', response?.length || 0);

    // Structure the data to match what the reducer expects
    const structuredData = {
      associations: response,
      totalCount: response.length,
      page: 1,
      pageSize: response.length,
    };
    console.log('📦 Structured data for store:', structuredData);
    thunkApi.dispatch(setAssociationsListAction(structuredData));
    return response;
  } catch (err) {
    console.error('❌ Error fetching associations:', err);
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Get associations list with pagination
export const getAssociationsPagedActionAsync = createAsyncThunk<any, { page?: number; pageSize?: number; category?: string }, { state: RootState }>(
  'ASSOCIATION__GET_PAGED',
  async (params, thunkApi) => {
    thunkApi.dispatch(setAssociationLoadingAction(true));
    try {
      const response = await getAssociationsPagedRequest(params);
      // The paginated endpoint returns the data in the correct structure already
      const structuredData = {
        associations: response.items,
        totalCount: response.totalCount,
        page: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      };
      thunkApi.dispatch(setAssociationsListAction(structuredData));
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setAssociationLoadingAction(false));
    }
  },
);

// Create association
export const createAssociationActionAsync = createAsyncThunk<any, any, { state: RootState }>(ASSOCIATION__CREATE, async (data, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    const response = await createAssociationRequest(data);
    alertService.successAlert('Association created successfully!');
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Update association
export const updateAssociationActionAsync = createAsyncThunk<void, { id: string; data: any }, { state: RootState }>(ASSOCIATION__UPDATE, async ({ id, data }, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    await updateAssociationRequest(id, data);

    // Refetch the association to get updated data
    await thunkApi.dispatch(getAssociationByIdActionAsync(id));

    alertService.successAlert('Association updated successfully!');
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Delete association
export const deleteAssociationActionAsync = createAsyncThunk<void, string, { state: RootState }>(ASSOCIATION__DELETE, async (id, thunkApi) => {
  thunkApi.dispatch(setAssociationLoadingAction(true));
  try {
    await deleteAssociationRequest(id);
    thunkApi.dispatch(removeAssociationFromListAction(id));
    alertService.successAlert('Association deleted successfully!');
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setAssociationLoadingAction(false));
  }
});

// Note: The following actions are commented out because the corresponding
// backend endpoints are not yet implemented:
// - updateAssociationLogoActionAsync (PUT /api/associations/{id}/logo)
// - updateAssociationCoverActionAsync (PUT /api/associations/{id}/cover)
// - searchAssociationsActionAsync (GET /api/associations/search)
// - getFeaturedAssociationsActionAsync (GET /api/associations/featured)
//
// For now, use updateAssociationActionAsync to update logo/cover as part of full update.
