"use server";

import { requireSession } from "@/lib/auth/guard";
import { isAiConfigurado } from "@/lib/ai/client";
import { sugerirDiagnosticos, redactarEvolucion } from "@/lib/ai/asistente";

export type AsistenteState = { resultado?: string; error?: string };

const EJEMPLO_DIAGNOSTICO =
  "Sugerencia de ejemplo (demo, sin llamar a la IA real):\n\n" +
  "K04.0 Pulpitis — podría corresponder si hay dolor espontáneo o al frío que persiste.\n" +
  "K02.1 Caries de la dentina — podría corresponder si se observa lesión cariosa activa.\n\n" +
  "En tu cuenta real, esta sugerencia la genera Claude a partir de tus notas.";

const EJEMPLO_EVOLUCION =
  "Evolución de ejemplo (demo, sin llamar a la IA real):\n\n" +
  "Paciente asiste a control, refiere mejoría de la sintomatología dolorosa. Al examen clínico no se " +
  "observan signos de inflamación activa. Se indica continuar con las recomendaciones dadas y control " +
  "en el tiempo estipulado.\n\nEn tu cuenta real, este texto lo redacta Claude a partir de tus notas.";

export async function pedirAyudaIaAction(_prev: AsistenteState, formData: FormData): Promise<AsistenteState> {
  const session = await requireSession();
  const tipoDemo = String(formData.get("tipo") ?? "diagnostico");

  if (session.esDemo) {
    return { resultado: tipoDemo === "evolucion" ? EJEMPLO_EVOLUCION : EJEMPLO_DIAGNOSTICO };
  }

  if (!isAiConfigurado()) {
    return {
      error:
        "El asistente de IA no está activado. Configura la variable ANTHROPIC_API_KEY para habilitar las sugerencias.",
    };
  }

  const notas = String(formData.get("notas") ?? "").trim();

  if (!notas) {
    return { error: "Escribe algunas notas para que el asistente pueda ayudarte." };
  }

  try {
    const resultado = tipoDemo === "evolucion" ? await redactarEvolucion(notas) : await sugerirDiagnosticos(notas);
    return { resultado };
  } catch {
    return { error: "No se pudo contactar al asistente de IA. Intenta de nuevo en unos minutos." };
  }
}
