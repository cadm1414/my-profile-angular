export interface UserProfile {
  id: number;
  email: string;
  name: string;
  last_name: string;
  full_name: string;
  domain?: string;
}

export interface GetMeResponse {
  id: number;
  email: string;
  name: string;
  last_name: string;
  full_name: string;
  domain?: string;
}

export interface UpdateProfileRequest {
  email: string;
  name: string;
  last_name: string;
  full_name: string;
  domain?: string;
}

export interface UpdateProfileResponse {
  id: number;
  email: string;
  name: string;
  last_name: string;
  full_name: string;
  domain?: string;
}
