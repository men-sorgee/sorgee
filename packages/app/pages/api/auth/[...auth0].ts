import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// import getConfig from "next/config";
// const { publicRuntimeConfig } = getConfig();
// const { baseUrl } = publicRuntimeConfig;

export default handleAuth();

/*
{
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: baseUrl + "/apply",
    });
  },
}*/
