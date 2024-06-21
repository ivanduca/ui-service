export const environment = {
  production: true,
  apiUrl: window["env"]["apiUrl"] || "default",
  debug: window["env"]["debug"] || false,
  baseHref: window["env"]["baseHref"] || "/",
  oidc: {
    enable: window["env"]["oidc.enable"] || false,
    force: window["env"]["oidc.force"] || false,
    authority: window["env"]["oidc.authority"],
    redirectUrl: window["env"]["oidc.redirectUrl"],
    clientId: window["env"]["oidc.clientId"],
    postLogoutRedirectUri: window["env"]["oidc.postLogoutRedirectUri"] || window.location.origin
  }
};