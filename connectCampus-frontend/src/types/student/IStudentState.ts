import IStudentResponse from './IStudentResponse';

interface IStudentState {
  currentStudent: IStudentResponse | null;
  studentsList: any;
  loading: boolean;
}

export default IStudentState;
