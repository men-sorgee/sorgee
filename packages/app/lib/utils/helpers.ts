import cookie from "cookie";
import { IncomingMessage, OutgoingMessage, ServerResponse } from "http";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const { dev } = publicRuntimeConfig;

export function toDateTime(secs: number) {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  if (!res.ok && res.status === 401) {
    throw new Error("Unauthorized");
  }
  return await res.json();
}

export function parseCookies(req: IncomingMessage) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export function setCookie(
  res: ServerResponse | OutgoingMessage,
  name: string,
  value: string,
  path: string = "/",
  maxAge: number = -1
) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name, value, {
      httpOnly: dev === true,
      secure: dev === false,
      sameSite: "strict",
      maxAge,
      path,
    })
  );
}
