export interface PublicProfile {
  full_name: string;
  email: string;
  domain: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface PublicProfileResponse {
  full_name: string;
  email: string;
  domain: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
}
