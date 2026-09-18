"use server";

import { requireSession } from "@/lib/auth/guard";
import { isAiConfigurado } from "@/lib/ai/client";
import { sugerirDiagnosticos, redactarEvolucion } from "@/lib/ai/asistente";

export type AsistenteState = { resultado?: string; error?: string };

export async function pedirAyudaIaAction(_prev: AsistenteState, formData: FormData): Promise<AsistenteState> {
  await requireSession();

  if (!isAiConfigurado()) {
    return {
      error:
        "El asistente de IA no está activado. Configura la variable ANTHROPIC_API_KEY para habilitar las sugerencias.",
    };
  }

  const tipo = String(formData.get("tipo") ?? "diagnostico");
  const notas = String(formData.get("notas") ?? "").trim();

  if (!notas) {
    return { error: "Escribe algunas notas para que el asistente pueda ayudarte." };
  }

  try {
    const resultado = tipo === "evolucion" ? await redactarEvolucion(notas) : await sugerirDiagnosticos(notas);
    return { resultado };
  } catch {
    return { error: "No se pudo contactar al asistente de IA. Intenta de nuevo en unos minutos." };
  }
}
