import { setTimeout } from 'node:timers/promises';

export const dynamic = 'force-dynamic';

const PREVIEW_WAIT_MS = 2_147_483_647;

export default async function LoadingPreviewPage() {
  await setTimeout(PREVIEW_WAIT_MS);

  return null;
}
