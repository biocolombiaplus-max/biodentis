import "server-only";
import { getAnthropicClient, AI_MODEL } from "@/lib/ai/client";

const SISTEMA_BASE =
  "Eres el asistente clínico de BioDentis, un software para consultorios odontológicos en Colombia. " +
  "Ayudas a odontólogos a documentar la historia clínica de forma clara y conforme a la Resolución 3100 de 2019. " +
  "Respondes siempre en español, de forma breve y profesional. Nunca inventas datos del paciente que no te den; " +
  "si falta información relevante, dilo explícitamente. Tus sugerencias son un apoyo y siempre deben ser " +
  "revisadas y validadas por el profesional de la salud responsable de la atención.";

async function preguntar(prompt: string, maxTokens = 700) {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: AI_MODEL,
    max_tokens: maxTokens,
    system: SISTEMA_BASE,
    output_config: { effort: "low" },
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}

export async function sugerirDiagnosticos(notasClinicas: string): Promise<string> {
  return preguntar(
    `Con base en estas notas clínicas de una atención odontológica, sugiere de 1 a 3 posibles códigos y ` +
      `descripciones CIE-10 relevantes (formato "CÓDIGO Descripción"), y una brevísima justificación por cada uno. ` +
      `No uses lenguaje absoluto ("es"), usa "podría corresponder a".\n\nNotas clínicas:\n${notasClinicas}`
  );
}

export async function redactarEvolucion(notasBreves: string): Promise<string> {
  return preguntar(
    `Convierte estas notas breves de un odontólogo en un párrafo de evolución clínica, formal y conciso, ` +
      `apto para quedar en la historia clínica. No agregues datos que no estén en las notas.\n\nNotas:\n${notasBreves}`
  );
}

export async function guiaResolucion3100(seccionActual: string): Promise<string> {
  return preguntar(
    `Un odontólogo está diligenciando la sección "${seccionActual}" de la historia clínica. ` +
      `Recuérdale en máximo 3 líneas qué información mínima exige la Resolución 3100 de 2019 para esa sección.`,
    300
  );
}
