export const oktaConfig = {
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  redirectUri: 'https://bookhivetr.netlify.app/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsChecks: true,
};
