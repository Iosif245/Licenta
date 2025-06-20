import { Role } from './Role';

interface IUser {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export default IUser;
