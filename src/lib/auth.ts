import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectMongo } from "@/lib/mongodb";

// Connect once, then build auth (safe with your cache)
const { client, db } = await connectMongo();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
});