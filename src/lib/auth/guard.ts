import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth/session";

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(roles: string[]): Promise<SessionPayload> {
  const session = await requireSession();
  if (!roles.includes(session.rol)) {
    redirect("/app");
  }
  return session;
}
