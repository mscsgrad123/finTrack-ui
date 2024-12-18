export const BackEnd = "http://localhost:8080";

export const oauthConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID, // Replace with your Client ID
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  redirectUri: "https://b1.d1l0vpr8rliqum.amplifyapp.com/",
  scope: "openid email profile",
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
};
