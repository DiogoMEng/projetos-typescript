export function formattedDate(dateAccount: string) {
  const date = new Date(dateAccount);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

  return formattedDate;
}
