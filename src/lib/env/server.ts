import z from "zod";
import { envClientCollectionObj, envClientSchemaObj } from "./client";

export const envServerSchemaObj = {
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().trim().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
};

const envServerCollectionObj = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

export const envServerSchema = z.object(Object.assign(envServerSchemaObj, envClientSchemaObj));

const envServerCollection = envServerSchema.safeParse(
  Object.assign(envServerCollectionObj, envClientCollectionObj),
);

if (!envServerCollection.success) {
  console.error(envServerCollection.error.issues);
  throw new Error("There is an error with the server environment variables");
}

export const envServer = envServerCollection.data;
