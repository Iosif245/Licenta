import IGetMeResponse from '@app/types/auth/IGetMeResponse';
import IUser from '@app/types/user/IUser';
import { Roles } from '@app/types/user/Role';
import { toString } from 'lodash';

export const mapGetMeResponseToUser = (data: Partial<IGetMeResponse>): IUser => {
  const allowedRoles = Object.values(Roles);
  const toRole = (role: string) => (allowedRoles.includes(role as Roles) ? (role as Roles) : undefined);

  const user: IUser = {
    id: toString(data?.id),
    email: toString(data?.email),
    role: toRole(data?.role),
    createdAt: (data as any)?.createdAt || new Date().toISOString(),
  };

  return user;
};
