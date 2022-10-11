function dateLineToSlash(date: string) {
  const regex = /(\d{4}).(\d+).(\d+)/
  const [, yyyy, mm, dd] = String(date).match(regex) as [string, string, string, string]
  return `${yyyy}/${Number(mm)}/${Number(dd)}`
}

export {
  dateLineToSlash,
}
