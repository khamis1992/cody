import type { MetaFunction } from '@remix-run/node';
import {
  BookOpenIcon,
  BriefcaseIcon,
  CloudIcon,
  CogIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export const meta: MetaFunction = () => {
  return [{ title: 'Resources | CodeLaunch' }];
};

const popularDocs = [
  {
    title: 'QuickStart Guide',
    description: 'Get started with CodeLaunch by building and publishing your first app.',
    href: '#',
  },
  {
    title: 'Troubleshooting',
    description: 'Resolve login issues and other known CodeLaunch problems.',
    href: '#',
  },
  {
    title: 'Integrations',
    description: 'Connect to tools like Github, Netlify, Figma, Supabase, and Stripe.',
    href: '#',
  },
];

const resourcesData = [
  {
    category: 'Get started with CodeLaunch',
    icon: RocketLaunchIcon,
    items: [
      { title: 'Introduction to CodeLaunch', href: '#' },
      { title: 'QuickStart guide', href: '#' },
      { title: 'Video tutorials', href: '#' },
    ],
  },
  {
    category: 'Working in CodeLaunch',
    icon: CogIcon,
    items: [
      { title: 'Supported technologies', href: '#' },
      { title: 'Project files and settings', href: '#' },
      { title: 'Interacting with CodeLaunch', href: '#' },
      { title: 'Backups and restore', href: '#' },
    ],
  },
  {
    category: 'CodeLaunch Cloud',
    icon: CloudIcon,
    items: [
      { title: 'Domains', href: '#' },
      { title: 'Hosting', href: '#' },
    ],
  },
  {
    category: 'Best practices',
    icon: BookOpenIcon,
    items: [
      { title: 'Plan your app', href: '#' },
      { title: 'Maximize token efficiency', href: '#' },
      { title: 'Prompt effectively', href: '#' },
      { title: 'Discussion mode tips', href: '#' },
    ],
  },
  {
    category: 'Using CodeLaunch with other tools',
    icon: BriefcaseIcon,
    items: [
      { title: 'Figma for design', href: '#' },
      { title: 'Supabase for databases', href: '#' },
      { title: 'Stripe for payments', href: '#' },
      { title: 'Netlify for hosting', href: '#' },
      { title: 'Expo for mobile apps', href: '#' },
      { title: 'GitHub for version control', href: '#' },
    ],
  },
  {
    category: 'Accounts and subscriptions',
    icon: CreditCardIcon,
    items: [
      { title: 'Billing', href: '#' },
      { title: 'Tokens', href: '#' },
      { title: 'Accounts', href: '#' },
      { title: 'Teams plans', href: '#' },
      { title: 'Corporate and commercial', href: '#' },
      { title: 'Referral program', href: '#' },
    ],
  },
  {
    category: 'Troubleshooting',
    icon: QuestionMarkCircleIcon,
    items: [
      { title: 'CodeLaunch issues', href: '#' },
      { title: 'Integrations issues', href: '#' },
      { title: 'Login issues', href: '#' },
      { title: 'Contact Support', href: '#' },
    ],
  },
  {
    category: 'Concepts and context',
    icon: CubeTransparentIcon,
    items: [
      { title: 'Introduction to LLMs', href: '#' },
      { title: 'Version history, version control, and GitHub', href: '#' },
    ],
  },
];

export default function Resources() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
            CodeLaunch Help Center
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Need help with CodeLaunch? Explore tutorials, FAQs, and support docs to quickly learn how to create websites
            and apps with AI.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="search"
              placeholder="Search for articles..."
              className="w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDocs.map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                className="bg-slate-900/70 p-6 rounded-lg border border-slate-800 hover:border-accent-500 hover:bg-slate-800/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 className="font-bold text-lg text-white mb-2">{doc.title}</h3>
                <p className="text-slate-400 text-sm">{doc.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourcesData.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <category.icon className="w-6 h-6 mr-3 text-accent-400" />
                {category.category}
              </h2>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} className="text-slate-300 hover:text-accent-400 transition-colors">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center text-slate-400 bg-slate-900/50 rounded-lg py-12 px-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="max-w-2xl mx-auto">
            The fastest way to get help is often from other users in the{' '}
            <a href="#" className="text-accent-400 font-semibold hover:underline">
              CodeLaunch Discord community
            </a>
            .
          </p>
          <p className="mt-3">
            You can also email our support team at{' '}
            <a href="mailto:support@codelaunch.ai" className="text-accent-400 font-semibold hover:underline">
              support@codelaunch.ai
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
