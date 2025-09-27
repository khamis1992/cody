export type ProjectSource = 'supabase' | 'vercel' | 'gitlab' | 'github';

export interface Project {
  id: string;
  name: string;
  description: string;
  source: ProjectSource;
  url: string;
  createdAt: string;
  updatedAt: string;
}
