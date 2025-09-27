import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import type { Project } from '~/types/project';

export const meta: MetaFunction = () => {
  return [{ title: 'My Projects | CodeLaunch' }];
};

export const loader = async () => {
  // Mock data for now, will be replaced with actual data fetching logic
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with a modern frontend and a robust backend.',
      source: 'github',
      url: 'https://github.com/example/ecommerce-platform',
      createdAt: '2023-01-15T14:20:00Z',
      updatedAt: '2023-10-28T10:00:00Z',
    },
    {
      id: '2',
      name: 'SaaS Dashboard',
      description: 'A software-as-a-service dashboard for managing users and subscriptions.',
      source: 'gitlab',
      url: 'https://gitlab.com/example/saas-dashboard',
      createdAt: '2023-03-22T18:30:00Z',
      updatedAt: '2023-10-25T16:45:00Z',
    },
    {
      id: '3',
      name: 'Mobile App Backend',
      description: 'A scalable backend for a cross-platform mobile application, built with Supabase.',
      source: 'supabase',
      url: 'https://app.supabase.io/project/example-mobile-app',
      createdAt: '2023-05-10T09:00:00Z',
      updatedAt: '2023-10-29T12:10:00Z',
    },
    {
      id: '4',
      name: 'Company Website',
      description: 'A responsive and SEO-friendly company website deployed on Vercel.',
      source: 'vercel',
      url: 'https://example-website.vercel.app',
      createdAt: '2023-07-19T11:45:00Z',
      updatedAt: '2023-10-20T14:30:00Z',
    },
  ];

  return json({ projects: mockProjects });
};

export default function ProjectPage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">My Projects</h1>
            <p className="text-lg text-slate-400 mt-2">
              Here you can manage all of your projects.
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-3 bg-accent-600 hover:bg-accent-500 rounded-lg transition-colors font-semibold"
          >
            Create New Project
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-900/70 p-6 rounded-lg border border-slate-800 hover:border-accent-500 transition-all duration-300">
                <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                <p className="text-slate-400 mt-2 text-sm">{project.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-slate-500 capitalize">{project.source}</span>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline text-sm font-semibold">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No Projects Yet</h2>
            <p className="text-slate-400 mt-4">
              Click the "Create New Project" button to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
