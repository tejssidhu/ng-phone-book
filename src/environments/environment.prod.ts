export const environment = {
  production: true,
  oidcConfig: {
    authority: 'https://sidhuidentityserver.azurewebsites.net',
    client_id: 'phonebook',
    redirect_uri: 'http://localhost:4200/signin-callback.html',
    post_logout_redirect_uri: 'http://localhost:4200',
    response_type: 'id_token token',
    scope: 'openid profile phonebookAPI.read phonebookAPI.write',
    silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTime: 4,
    filterProtocolClaims: true,
    loadUserInfo: true
  },
  serviceRootUrl: 'https://phonebookapiapp.azurewebsites.net/'
};
