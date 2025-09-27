import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Chat } from '~/components/chat/Chat.client';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch' },
    {
      name: 'description',
      content: 'Code Launch, an AI code generation platform',
    },
  ];
};

export async function loader() {
  const GITHUB_TEMPLATE_URL =
    'https://raw.githubusercontent.com/Codelaunch-dev/templates/main/templates.json';
  try {
    const response = await fetch(GITHUB_TEMPLATE_URL);
    if (!response.ok) {
      console.error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
      return json([]);
    }
    const templates = await response.json();
    return json(templates);
  } catch (error) {
    console.error('Failed to parse templates JSON:', error);
    return json([]);
  }
}

export default function Index() {
  const templates = useLoaderData<typeof loader>();
  return (
    <main className="relative h-screen">
      <BackgroundRays />
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1.8',
        }}
      >
        <Chat templates={templates} />
      </div>
    </main>
  );
}
