(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["apiUrl"] = "https://dica33.ba.cnr.it/";
    window["env"]["baseHref"] = "/";
    window["env"]["production"] = false;
    window["env"]["oidc.enable"] = false;
    window["env"]["oidc.force"] = false;    
    window["env"]["oidc.authority"] = "http://dockerwebtest02.si.cnr.it:8110/auth/realms/cnr/.well-known/openid-configuration";
    window["env"]["oidc.redirectUrl"] = "http://localhost:4200/auth/signin";
    window["env"]["oidc.clientId"] = "angular-public";
    window["env"]["oidc.postLogoutRedirectUri"] = "https://apps.cnr.it";
  })(this);