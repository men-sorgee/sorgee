import { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig();
const { dev } = publicRuntimeConfig

export function parseCookies(req: NextApiRequest) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export function getCookie(req: NextApiRequest, name: string) {
  const cookies = parseCookies(req)
  return cookies[name]
}

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  path: string = "/",
  maxAge: number = -1
) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name, value, {
      httpOnly: dev === false,
      secure: dev === false,
      sameSite: "strict",
      maxAge,
      path,
    })
  );
}
