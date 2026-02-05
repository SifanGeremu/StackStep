import { betterAuth } from "better-auth";

const auth = betterAuth({
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: ["openid", "email", "profile"], // only basic info
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET, // long random string from .env
  },
});

export default auth;
