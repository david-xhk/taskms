export function getNote(req, res) {
  const { note } = res.locals
  res.json({ success: true, data: note })
}
