import { HttpMethod } from '../services/api';
import { ApiResponse } from '../types';

export function toDateTime(secs: number) {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
}

export async function getJSON<T = any>(
  url: string
): Promise<[boolean, ApiResponse<T>]> {
  return await fetchJSON(url);
}

export async function postJSON<T = any>(url: string, data: object) {
  return await fetchJSON(url, data, 'POST');
}

export async function fetchJSON<T = never | any>(
  url: string,
  data?: object,
  method: HttpMethod = 'GET',
  headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
): Promise<[boolean, ApiResponse<T>]> {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? Buffer.from(JSON.stringify(pruneUndefined(data))) : undefined
  });

  try {
    const body = (await response.json()) as ApiResponse<T>;
    return [response.ok, body];
  } catch {
    return [response.ok, { data: null }];
  }
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export function pruneUndefined(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ''
    )
  );
}
