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
  const response = await fetch(GITHUB_TEMPLATE_URL);
  const templates = await response.json();
  return json(templates);
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
