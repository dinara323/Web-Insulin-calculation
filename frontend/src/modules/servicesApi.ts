export interface InsulinService {
  id: number;
  name: string;
  description: string;
  age: number | null;
  weight: number | null;
  sensitivityCoefficient: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { credentials: 'include', signal });
  if (!response.ok) throw new Error(`API: ${response.status}`);
  return response.json() as Promise<T>;
}

export const getServices = (name = '', signal?: AbortSignal) =>
  getJson<InsulinService[]>(`/api/services?${new URLSearchParams({ name })}`, signal);

export const getServiceById = (id: string, signal?: AbortSignal) =>
  getJson<InsulinService>(`/api/services/feed?${new URLSearchParams({ id })}`, signal);
