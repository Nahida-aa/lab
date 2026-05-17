export const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.apng', '.avif', '.webp'] as const
type ImageExtension = typeof imageExtensions[number]
type AcceptExtension = ImageExtension | '.pdf' | '.doc' | '.docx' | '.ppt' | '.pptx' | '.txt' | '.zip' | '.rar' | '.csv' | '.xls' | '.xlsx' | '.json' | '.xml' | '.yaml' | '.yml' | '.csv' | '.tsv' | '.gz' | '.bz2' | '.7z' | '.tar' | '.tgz' | '.tar.gz' | '.tar.bz2' | '.tar.7z' | '.txt' | '.csv' | '.tsv' | '.json' | '.xml' | '.yaml' | '.yml' | '.pdf' | '.doc' | '.docx' | '.ppt' | '.pptx' | '.txt' | '.zip' | '.rar' | '.csv' | '.xls' | '.xlsx'
// ... more types 用于自定义

// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/MIME_types
// 有一个注册表
type AcceptMime = 'image/*'
export const imageMimes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] as const
type ImageMime = typeof imageMimes[number]
type Mime = ImageMime | 'application/pdf' | 'application/gzip' | 'application/x-bzip2' | 'application/x-7z-compressed' | 'application/x-tar' | 'application/x-compressed' | 'application/x-tgz' | 'application/x-bzip-compressed' | 'application/x-7z-compressed' | 'text/tab-separated-values' | 'application/msword' | 'application/vnd.ms-powerpoint' | 'text/plain' | 'application/zip' | 'application/x-rar-compressed' | 'text/csv' | 'application/vnd.ms-excel' | 'application/json' | 'application/xml' | 'text/yaml' | 'application/pdf' | 'application/msword' | 'application/vnd.ms-powerpoint' | 'text/plain' | 'application/zip' | 'application/x-rar-compressed' | 'text/csv' | 'application/vnd.ms-excel' | 'application/json' | 'application/xml' | 'text/yaml'
export type AcceptItem = AcceptExtension | AcceptMime | Mime
export const buildAccept = (items: AcceptItem[]) => items.join(',')
const acceptToMimeMap: Record<string, (Mime | readonly Mime[])> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.gz': 'application/gzip',
  '.bz2': 'application/x-bzip2',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.tgz': 'application/x-compressed',
  '.tar.gz': 'application/x-tgz',
  '.tar.bz2': 'application/x-bzip-compressed',
  '.tar.7z': 'application/x-7z-compressed',
  '.tsv': 'text/tab-separated-values',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/msword',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.ms-powerpoint',
  '.txt': 'text/plain',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.csv': 'text/csv',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.ms-excel',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  'image/*': imageMimes
} as const
export const acceptToMime = (accepts: string[]) => {
  const mimes = accepts.map(item => {
    const mime = acceptToMimeMap[item]
    if (mime) {
      return Array.isArray(mime) ? mime : [mime]
    }
    return []
  })
  return mimes.flat()
}

export const isImage = ({ file, url }: { file?: File, url?: string }) => {
  if (file) {
    return file.type.startsWith('image/')
  } else if (url) {
    const ext = url.split('.').pop()
    return imageExtensions.includes(`.${ext}` as ImageExtension)
  }
}

export const fileGroup = ['avatar', 'project', 'version', 'certify', 'other'] as const
export type FileGroup = (typeof fileGroup)[number]
