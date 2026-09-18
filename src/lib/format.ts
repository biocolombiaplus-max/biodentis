export function formatCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function calcularEdad(fechaNacimiento: Date): number {
  const ahora = Date.now();
  return Math.floor((ahora - fechaNacimiento.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export function formatFechaCorta(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}
