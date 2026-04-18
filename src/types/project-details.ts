export interface ProjectImage{
  id: number;
  path: string;
}
export interface ProjectDetails  {
    id: number;
    title: string;
    status: string;
    is_featured: boolean;
    start_date: string;
    end_date: string;
    created_at: string;
    details: string;
    target: number;
    current_money: number;
    images_urls: ProjectImage[];
    is_reported_by_me: boolean;
    category_name: string;
    user_fullname: string;
    user_profile_pic: string | null;
    tags_names: string[];
    avg_rate: number;
}
