export function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function formatMonth(value: string | undefined): string {
  if (!value) return "present";
  const [year, month] = value.split("-");
  const monthName = new Date(`${year}-${month}-01T00:00:00Z`).toLocaleString("en", {
    month: "short",
  });
  return `${monthName.toLowerCase()} ${year}`;
}
