export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8080',
  azureAd: {
    clientId: 'CHANGE_ME_SPA_CLIENT_ID',
    tenantId: 'CHANGE_ME_TENANT_ID',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    apiScope: 'api://CHANGE_ME_API_CLIENT_ID/access_as_user',
  },
};
