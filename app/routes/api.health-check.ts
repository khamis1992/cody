import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { createHealthCheckEndpoint } from '~/lib/.server/monitoring';

const healthCheckHandler = createHealthCheckEndpoint();

export async function loader({ request }: LoaderFunctionArgs) {
  return healthCheckHandler(request);
}

export async function action({ request }: LoaderFunctionArgs) {
  return healthCheckHandler(request);
}