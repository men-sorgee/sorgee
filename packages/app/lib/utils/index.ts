import { ApiResponse } from '../types';

export function toDateTime(secs: number) {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
}

export async function getJSON<T = any>(
  url: string,
  headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
): Promise<[boolean, ApiResponse<T>]> {
  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers(headers)
  });

  if (response.body != null) {
    const body = (await response.json()) as ApiResponse<T>;
    return [response.ok, body];
  }
  return [response.ok, null];
}

export async function postJSON<T = never | any>(
  url: string,
  data: object
): Promise<[boolean, ApiResponse<T>]> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: Buffer.from(JSON.stringify(pruneUndefined(data)))
  });

  if (response.bodyUsed) {
    const body = (await response.json()) as ApiResponse<T>;
    return [response.ok, body];
  }
  return [response.ok, null];
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
