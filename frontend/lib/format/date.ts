const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/

export function formatDate(iso: string): string {
  const match: RegExpExecArray | null = ISO_DATE.exec(iso)
  if (match === null) {
    return iso
  }

  const year: number = Number(match[1])
  const month: number = Number(match[2])
  const day: number = Number(match[3])
  const utc: Date = new Date(Date.UTC(year, month - 1, day))

  return Number.isNaN(utc.getTime()) ? iso : dateFormatter.format(utc)
}
