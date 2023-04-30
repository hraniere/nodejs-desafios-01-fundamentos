export const buildPathPattern = path => {
  const paramPattern = /\/:([\w]+)/g
  const argumentPattern = '/(?<$1>[\\w-]+)'
  const pathPattern = new RegExp(path.replace(paramPattern, argumentPattern))

  return pathPattern
} 