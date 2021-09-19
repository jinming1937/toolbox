import path from 'path'

export const getIPAdress = () => {
  return '127.0.0.1'
}

export function resolve(dir: string): string {
  return path.join(__dirname, '..', dir)
}

export const STATIC_HOST = 'jm.lit.net'
