export const appParams = {
  appId: import.meta.env.VITE_BASE44_APP_ID || 'mock-app-id',
  token: import.meta.env.VITE_BASE44_AUTH_TOKEN || '',
  functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || window.location.origin,
};

export default appParams;
