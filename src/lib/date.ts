function padTwoDigits(value: number) {
  return String(value).padStart(2, "0");
}

// valores no formato aceito pelos inputs nativos de data ("yyyy-MM-dd") e hora ("HH:mm")
export function getCurrentDateTimeInputValues() {
  const now = new Date();

  return {
    date: `${now.getFullYear()}-${padTwoDigits(now.getMonth() + 1)}-${padTwoDigits(now.getDate())}`,
    time: `${padTwoDigits(now.getHours())}:${padTwoDigits(now.getMinutes())}`,
  };
}
