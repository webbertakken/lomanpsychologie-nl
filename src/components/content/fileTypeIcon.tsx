export const fileTypeIcon = (contentType: string) => {
  if (!contentType) return 'FaRegFile'

  if (contentType.startsWith('image/')) return 'FaRegFileImage'
  if (contentType.startsWith('video/')) return 'FaRegFileVideo'
  if (contentType.startsWith('audio/')) return 'FaRegFileAudio'
  if (contentType.startsWith('text/')) return 'FaRegFileAlt'

  switch (contentType) {
    case 'application/pdf':
      return 'FaRegFilePdf'
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'FaRegFileWord'
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'FaRegFileExcel'
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'FaRegFilePowerpoint'
    case 'application/zip':
    case 'application/x-rar-compressed':
    case 'application/x-7z-compressed':
    case 'application/x-tar':
    case 'application/x-bzip':
    case 'application/x-bzip2':
      return 'FaRegFileArchive'
    default:
      return 'FaRegFile'
  }
}
