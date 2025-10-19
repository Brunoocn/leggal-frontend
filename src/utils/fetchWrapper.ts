import { getCookie } from 'cookies-next';

interface RequestInits extends RequestInit {
  responseType?: 'json' | 'blob';
}

export async function fetchWrapper<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInits | undefined
) {
  const headers: any = {};
  const token = getCookie('LEGGAL::TOKEN');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${input}`,
    {
      ...init,
      headers: { ...init?.headers, ...headers },
    }
  );

  if (res.status === 204) {
    return null as T;
  }

  const contentLength = res.headers.get('Content-Length');
  const result =
    contentLength === '0' ? null : await res[init?.responseType || 'json']();
  if (res.ok) {
    return result as T;
  } else {
    throw new Error(result.message);
  }
}
