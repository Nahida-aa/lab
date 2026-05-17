import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AuthSession } from "./auth.provider";

export const serverAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // pass the headers
  });
  return session as AuthSession;
};
