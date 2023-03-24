export const oktaConfig = {
  clientId: '0oa8o9znnqpfKwxZt5d7',
  issuer: 'https://dev-73647973.okta.com/oauth2/default',
  redirectUri: 'https://bookhivetr.netlify.app/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsChecks: true,
};
