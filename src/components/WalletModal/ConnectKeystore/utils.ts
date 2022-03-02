export const loadFile = (
  file: File,
  onLoadHandler: (reader: FileReader) => void,
  onErrorFile: () => void,
) => {
  return new Promise(() => {
    const reader = new FileReader()

    reader.addEventListener('load', () => onLoadHandler(reader), false)

    reader.addEventListener('error', onErrorFile, false)

    if (file) {
      reader.readAsText(file)
    }

    return () => {
      reader.removeEventListener('load', () => onLoadHandler(reader))
    }
  })
}
