import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { hashPassword, verifyPassword } from "./password.js";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "SportsHub",

  trustedOrigins: ["http://localhost:3000"],

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

  plugins: [
  jwt({
    jwt: {
      expirationTime: "1h",

      definePayload: ({ user }) => {
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