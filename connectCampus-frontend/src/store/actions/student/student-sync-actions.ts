import { createAction } from '@reduxjs/toolkit';
import { STUDENT__SET, STUDENT__SET_LIST, STUDENT__SET_LOADING, STUDENT__RESET } from '../../constants';
import IStudentResponse from '@app/types/student/IStudentResponse';

export const setStudentAction = createAction<IStudentResponse>(STUDENT__SET);
export const setStudentsListAction = createAction<any>(STUDENT__SET_LIST);
export const setStudentLoadingAction = createAction<boolean>(STUDENT__SET_LOADING);
export const resetStudentAction = createAction<void>(STUDENT__RESET);
export const updateStudentInListAction = createAction<IStudentResponse>('student/updateInList');
export const removeStudentFromListAction = createAction<string>('student/removeFromList');
