export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  profile_pic: string | null;
  birthdate: string | null;
  fb_profile: string | null;
  country: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  profile_pic?: File;
  birthdate?: string;
  fb_profile?: string;
  country?: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  details: string;
  target: number;
  current_money: number;
  start_date: string;
  end_date: string;
  status: string;
  images_urls?: { id: number; path: string }[];
  avg_rate: number;
  created_at: string;
}

export interface DonationItem {
  id: number;
  amount: number;
  project: number;
  project_name: string;
  user_fullname: string;
  created_at: string;
}
