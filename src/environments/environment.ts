// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  oidcConfig: {
    authority: 'https://localhost:44301',
    // authority: 'https://sidhuidentityserver.azurewebsites.net',
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
  serviceRootUrl: 'http://localhost/Phonebook.WebApi/'
  // serviceRootUrl: 'https://phonebookapiapp.azurewebsites.net/'
};
