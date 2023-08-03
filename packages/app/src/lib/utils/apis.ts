import { pruneUndefined } from "."

export function ApiResponse<T = any | any>(
  data: T,
  error?: string,
  field?: string & keyof T
): ApiResponse<T> {
  return {
    data: data || ({} as T),
    error: { message: error, field },
  }
}

export type ApiResult<T = any> = {
  success: boolean
  data?: T
  error?: ApiError
}

export type ApiResponse<T = (object & never) | any> = {
  error: ApiError
  data: T
}

export type ApiError = {
  field?: string
  message: string
}

export type HttpMethod = (string & 'GET') | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export async function getJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url)
}

export async function postJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'POST')
}


export async function putJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'PUT')
}



export async function deleteJSON<T = never | any, R = DefaultTo<null, T>>(
  url: string,
  data?: T
): Promise<ApiResult<R>> {
  return await fetchJSON<T, R>(url, data, 'DELETE')
}

export async function fetchJSON<T = object | any, R = DefaultTo<null, T>>(
  url: string,
  data?: T,
  method: HttpMethod = 'GET',
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
): Promise<ApiResult<R>> {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? Buffer.from(JSON.stringify(pruneUndefined(data))) : undefined,
  })
  const { ok: success } = response
  try {
    const body = (await response.json()) as ApiResponse<R>
    if (!body) {
      return { success, error: { message: 'No response body' } }
    }
    const { data, error } = body
    return { success, data, error } as ApiResult<R>
  } catch (error) {
    return { success, error: { message: error.message || error } }
  }
}

export async function postForm<T = any>(
  url: string,
  withForm: (f: FormData) => void
): Promise<ApiResult<T>> {
  const data = new FormData()
  withForm(data)
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  })
  const { ok: success } = response
  try {
    const body = (await response.json()) as ApiResponse<T>
    if (!body) {
      return { success, error: { message: 'No response body' } }
    }
    const { data, error } = body
    return { success, data, error } as ApiResult<T>
  } catch (error) {
    return { success, error: { message: error.message || error } }
  }
}
