import { useStore } from '@nanostores/react';
import { supabaseConnection } from '~/lib/stores/supabase';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Table {
  tablename: string;
}

export function DatabaseViewer() {
  const connection = useStore(supabaseConnection);
  const { isConnected, token, selectedProjectId } = connection;
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectClick = () => {
    document.dispatchEvent(new CustomEvent('open-supabase-connection'));
  };

  useEffect(() => {
    if (isConnected && token && selectedProjectId) {
      const fetchTables = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/supabase/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              projectId: selectedProjectId,
              query: `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';`,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch tables');
          }

          const data = await response.json();
          setTables(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          setError(errorMessage);
          toast.error(`Error fetching tables: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTables();
    }
  }, [isConnected, token, selectedProjectId]);

  return (
    <div className="h-full bg-slate-900 text-white p-4 overflow-y-auto">
      {isConnected ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Database Tables</h2>
          {isLoading ? (
            <p className="text-slate-400">Fetching tables...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="space-y-2">
              {tables.map((table) => (
                <li key={table.tablename} className="bg-slate-800/50 p-3 rounded-md">
                  <span className="font-mono">{table.tablename}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-4">Not Connected to Supabase</h2>
          <p className="text-slate-400 mb-6 text-center">
            Please connect to your Supabase project to view your database tables.
          </p>
          <button
            onClick={handleConnectClick}
            className="px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg transition-colors font-semibold"
          >
            Connect to Supabase
          </button>
        </div>
      )}
    </div>
  );
}
