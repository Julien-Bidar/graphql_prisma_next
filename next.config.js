require("dotenv").config();

const {
  DATABASE_URL,
  AUTH0_CLIENT_ID,
  AUTH0_ISSUER_BASE_URL,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_SECRET,
  AUTH0_SECRET,
  AUTH0_BASE_URL,
  AUTH0_SCOPE,
  AUTH0_COOKIE,
  BACKEND_ADDRESS,
} = process.env;

module.exports = {
  publicRuntimeConfig: {
    BACKEND_URL: `${BACKEND_ADDRESS}/api/graphql`,
  },
  serverRuntimeConfig: {
    auth: {
      // domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      issuerBaseURL: AUTH0_ISSUER_BASE_URL,
      clientSecret: AUTH0_CLIENT_SECRET,
      secret: AUTH0_SECRET,
      baseURL: AUTH0_BASE_URL,
      // scope: AUTH0_SCOPE,
      // redirectUri: `${BACKEND_ADDRESS}/api/callback`,
      // postLogoutRedirectUri: `${BACKEND_ADDRESS}/`,
    },
    cookieSecret: AUTH0_COOKIE,
  },
};
