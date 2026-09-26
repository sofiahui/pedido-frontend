export const environment = {
  production: true,
  apiBaseUrl: 'https://2pfy1s9tii.execute-api.us-east-1.amazonaws.com',
  azureAd: {
    clientId: 'e39233a2-6c2a-4465-bbb0-538718a6d021',
    tenantId: '391785ea-8a93-4b03-aa6f-34f76498a5ad',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    apiScope: 'api://9f968a39-1844-4166-ada1-5833116eda90/access_as_user',
  },
};
