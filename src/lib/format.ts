// Datas chegam da API como "yyyy-MM-dd" e horas como "HH:mm:ss"; a conversão é
// feita por texto para evitar deslocamentos de fuso horário do objeto Date.
export function formatDate(isoDate: string | null): string {
  if (!isoDate) return "—";

  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function formatTime(time: string | null): string {
  return time ? time.slice(0, 5) : "—";
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
