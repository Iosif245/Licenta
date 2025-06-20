import IStudentState from '@app/types/student/IStudentState';
import { createReducer } from '@reduxjs/toolkit';
import {
  setStudentAction,
  setStudentsListAction,
  setStudentLoadingAction,
  resetStudentAction,
  updateStudentInListAction,
  removeStudentFromListAction,
} from '../actions/student/student-sync-actions';

const initialState: IStudentState = {
  currentStudent: null,
  studentsList: {
    students: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
  },
  loading: false,
};

const studentReducer = createReducer(initialState, builder =>
  builder
    .addCase(setStudentAction, (state, action) => ({
      ...state,
      currentStudent: action.payload,
    }))
    .addCase(setStudentsListAction, (state, action) => ({
      ...state,
      studentsList: action.payload,
    }))
    .addCase(setStudentLoadingAction, (state, action) => ({
      ...state,
      loading: action.payload,
    }))
    .addCase(updateStudentInListAction, (state, action) => ({
      ...state,
      studentsList: {
        ...state.studentsList,
        students: state.studentsList.students.map((student: any) => (student.id === action.payload.id ? action.payload : student)),
      },
    }))
    .addCase(removeStudentFromListAction, (state, action) => ({
      ...state,
      studentsList: {
        ...state.studentsList,
        students: state.studentsList.students.filter((student: any) => student.id !== action.payload),
        totalCount: state.studentsList.totalCount - 1,
      },
    }))
    .addCase(resetStudentAction, () => initialState),
);

export default studentReducer;
