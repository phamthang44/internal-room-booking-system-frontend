export interface UpdateProfilePayload {
  fullName: string;
}

export interface UpdateProfileResponse {
  fullName: string;
  username: string;
  email: string;
  studentCode: string;
  roleName: string;
  avatar?: string;
}
