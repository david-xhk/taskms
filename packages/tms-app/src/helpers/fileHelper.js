export function downloadCsvFile(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" })
  downloadFile(blob, `${filename}.csv`)
}

export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  downloadFile(blob, `${filename}.txt`)
}

export function downloadFile(blob, filename) {
  const element = document.createElement("a")
  element.setAttribute("href", URL.createObjectURL(blob))
  element.setAttribute("download", filename)
  element.style.visibility = "hidden"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// https://stackoverflow.com/a/68771795
export function generateCsv(rows, columns, accessors, separator = ",") {
  const rowContent = rows.map(row =>
    (accessors ?? columns)
      .map(key => {
        let cell = row[key] === null || row[key] === undefined ? "" : row[key]
        cell = cell instanceof Date ? cell.toString() : cell.toString().replace(/"/g, '""')
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`
        }
        return cell
      })
      .join(separator)
  )
  return `${columns.join(separator)}\n${rowContent.join("\n")}`
}
