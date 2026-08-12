import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins";

import { prisma } from "./prisma.js";
import {
  hashPassword,
  verifyPassword,
} from "./password.js";

const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

const backendUrl =
  process.env.BETTER_AUTH_URL ||
  "http://localhost:5000";

export const auth = betterAuth({
  appName: "SportsHub",

  baseURL: backendUrl,

  trustedOrigins: [frontendUrl],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        required: false,
        defaultValue: "USER",
        input: false,
      },

      status: {
        type: ["ACTIVE", "BLOCKED"],
        required: false,
        defaultValue: "ACTIVE",
        input: false,
      },

      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },

  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",

        definePayload: ({
          user,
        }) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        },
      },
    }),
  ],
});