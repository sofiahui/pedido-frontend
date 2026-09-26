export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8080',
  azureAd: {
    clientId: 'a2564ef7-dfb3-4ab3-a959-e987e051e58c',
    tenantId: 'a49d895e-910c-431b-a321-f86038460e12',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    apiScope: 'api://0a2fa07e-9f53-4caa-af3e-520c0dc8b941/access_as_user',
  },
};
