export interface Project {
  id: number;
  title: string;
  details: string;
  target: number;
  current_money: number;
  avg_rate: number;
  calculate_average_rating: number;
  category_name: string;
  user_fullname: string;
  uploaded_image_url: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: number;
  name: string;
}

export interface HomepageData {
  latest: Project[];
  featured: Project[];
  top_rated: Project[];
  categories: Category[];
}


