// Utilidades de formato para toda la app

export function formatPriceCLP(price?: number | null): string {
  if (typeof price !== "number" || isNaN(price)) return "-";
  return "$" + price.toLocaleString("es-CL");
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CL");
}

export function formatBool(value?: boolean | null, yes: string = "Sí", no: string = "No"): string {
  return value ? yes : no;
}
