"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y tu contraseña." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !usuario.activo) {
    return { error: "Credenciales inválidas o usuario inactivo." };
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    return { error: "Credenciales inválidas." };
  }

  const token = await createSessionToken({
    userId: usuario.id,
    clinicaId: usuario.clinicaId,
    rol: usuario.rol,
    nombre: usuario.nombre,
    email: usuario.email,
  });
  await setSessionCookie(token);
  redirect("/app");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
