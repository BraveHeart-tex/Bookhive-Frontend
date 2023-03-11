export const oktaConfig = {
  clientId: '0oa8o9znnqpfKwxZt5d7',
  issuer: 'https://dev-73647973.okta.com/oauth2/default',
  redirectUri: 'http://localhost:5173/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsChecks: true,
};
