import { betterAuth } from "better-auth";
const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: ["openid", "email", "profile"],
    },
  },
  jwt: { secret: process.env.JWT_SECRET },
});
export default auth;
