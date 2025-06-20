import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import {
  STUDENT__GET_BY_ID,
  STUDENT__GET_LIST,
  STUDENT__CREATE,
  STUDENT__UPDATE,
  STUDENT__DELETE,
  STUDENT__UPDATE_AVATAR,
  STUDENT__UPDATE_INTERESTS,
  STUDENT__SEARCH,
} from '@app/store/constants';
import ApiException from '@app/types/api/ApiException';
import {
  getStudentByIdRequest,
  getStudentsRequest,
  createStudentRequest,
  updateStudentRequest,
  deleteStudentRequest,
  updateStudentAvatarRequest,
  updateStudentInterestsRequest,
  searchStudentsRequest,
} from '@app/api/requests/student-requests';
import alertService from '@app/services/alert';
import { setStudentAction, setStudentsListAction, setStudentLoadingAction, updateStudentInListAction, removeStudentFromListAction } from './student-sync-actions';
import { fetchProfileActionAsync } from '../profile/profile-async-actions';

// Get student by ID
export const getStudentByIdActionAsync = createAsyncThunk<any, string, { state: RootState }>(STUDENT__GET_BY_ID, async (id, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    const response = await getStudentByIdRequest(id);
    thunkApi.dispatch(setStudentAction(response as any));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});

// Get students list
export const getStudentsActionAsync = createAsyncThunk<any, any, { state: RootState }>(STUDENT__GET_LIST, async (params, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    const response = await getStudentsRequest(params);
    thunkApi.dispatch(setStudentsListAction(response));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});

// Create student
export const createStudentActionAsync = createAsyncThunk<any, any, { state: RootState }>(STUDENT__CREATE, async (data, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    const response = await createStudentRequest(data);
    alertService.successAlert('Student profile created successfully!');
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});

// Update student
export const updateStudentActionAsync = createAsyncThunk<void, { id: string; data: any }, { state: RootState }>(STUDENT__UPDATE, async ({ id, data }, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    await updateStudentRequest(id, data);

    // Refetch the student to get updated data
    await thunkApi.dispatch(getStudentByIdActionAsync(id));

    alertService.successAlert('Student profile updated successfully!');
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});

// Delete student
export const deleteStudentActionAsync = createAsyncThunk<void, string, { state: RootState }>(STUDENT__DELETE, async (id, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    await deleteStudentRequest(id);
    thunkApi.dispatch(removeStudentFromListAction(id));
    alertService.successAlert('Student profile deleted successfully!');
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});

// Update student avatar
export const updateStudentAvatarActionAsync = createAsyncThunk<any, { id: string; avatar: File }, { state: RootState }>(
  STUDENT__UPDATE_AVATAR,
  async ({ id, avatar }, thunkApi) => {
    thunkApi.dispatch(setStudentLoadingAction(true));
    try {
      const response = await updateStudentAvatarRequest(id, avatar);
      thunkApi.dispatch(updateStudentInListAction({ id, avatarUrl: response.avatarUrl } as any));
      alertService.successAlert('Avatar updated successfully!');
      return response;
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setStudentLoadingAction(false));
    }
  },
);

// Update student interests
export const updateStudentInterestsActionAsync = createAsyncThunk<void, { id: string; interests: string[] }, { state: RootState }>(
  STUDENT__UPDATE_INTERESTS,
  async ({ id, interests }, thunkApi) => {
    thunkApi.dispatch(setStudentLoadingAction(true));
    try {
      await updateStudentInterestsRequest(id, interests);
      thunkApi.dispatch(updateStudentInListAction({ id, interests } as any));

      // Refetch profile to ensure UI is updated with latest data
      await thunkApi.dispatch(fetchProfileActionAsync());

      alertService.successAlert('Interests updated successfully!');
    } catch (err) {
      if (err instanceof ApiException) {
        err.show();
      }
      throw err;
    } finally {
      thunkApi.dispatch(setStudentLoadingAction(false));
    }
  },
);

// Search students
export const searchStudentsActionAsync = createAsyncThunk<any, { query: string; filters?: any }, { state: RootState }>(STUDENT__SEARCH, async ({ query, filters }, thunkApi) => {
  thunkApi.dispatch(setStudentLoadingAction(true));
  try {
    const response = await searchStudentsRequest(query, filters);
    thunkApi.dispatch(setStudentsListAction(response));
    return response;
  } catch (err) {
    if (err instanceof ApiException) {
      err.show();
    }
    throw err;
  } finally {
    thunkApi.dispatch(setStudentLoadingAction(false));
  }
});
