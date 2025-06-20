interface ILoginResponse {
  accessToken: string;
  requiresTwoFactor?: boolean;
  userId?: string;
}

export default ILoginResponse;
