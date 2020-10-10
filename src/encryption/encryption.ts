import openpgp, { message, util } from 'openpgp'
import { append, uniq } from 'ramda'

const ALGORITHM = 'AES-GCM'
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const generateIv = (): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}
const pack = (buffer: ArrayBuffer): string => {
  // @ts-ignore
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
}
const unpack = (packed: string): ArrayBuffer => {
  const string = window.atob(packed)
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }

  return buffer
}

export const initEncryption = () => {
  openpgp.initWorker({
    n: 2,
    path: '/openpgp.worker.min.js',
  })
}

export class EncryptionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'EncryptionError'
  }
}

export class Encryption {
  static setPassword(budget: string | undefined, password: string): void {
    if (budget) {
      const storedBudgetsPasswords: string[] = JSON.parse(localStorage.getItem('encryption-passwords-budgets') || '[]')
      localStorage.setItem(`encryption-password-${budget}`, password)
      localStorage.setItem('encryption-passwords-budgets', JSON.stringify(uniq(append(budget, storedBudgetsPasswords))))
    }
  }

  static movePassword(oldBudget: string, newBudget: string): void {
    const storedBudgetsPasswords = JSON.parse(localStorage.getItem('encryption-passwords-budgets') || '[]')
    const password = localStorage.getItem(`encryption-password-${oldBudget}`) || ''
    storedBudgetsPasswords.splice(storedBudgetsPasswords.findIndex((b: string) => b === oldBudget), 1)
    storedBudgetsPasswords.push(newBudget)
    localStorage.removeItem(`encryption-password-${oldBudget}`)
    localStorage.setItem(`encryption-password-${newBudget}`, password)
    localStorage.setItem('encryption-passwords-budgets', JSON.stringify(storedBudgetsPasswords))
  }

  static removePasswords(): void {
    const storedBudgetsPasswords = JSON.parse(localStorage.getItem('encryption-passwords-budgets') || '[]')
    storedBudgetsPasswords.forEach(this.removePassword)
    localStorage.removeItem('encryption-passwords-budgets')
  }

  static removePassword(budget: string | undefined): void {
    if (budget) {
      localStorage.removeItem(`encryption-password-${budget}`)
    }
  }

  static hasEncryptionPassword(budget: string | undefined): boolean {
    if (budget) {
      return this.getPassword(budget) !== null
    }

    return false
  }

  static getPassword(budget: string): string | null {
    return localStorage.getItem(`encryption-password-${budget}`)
  }

  static async encrypt(budget: string | undefined, text: string): Promise<string> {
    if (budget) {
      const key = await this.getKey(budget)
      const iv = generateIv()
      const options = {
        name: ALGORITHM,
        iv,
      }

      return JSON.stringify({
        cipher: pack(await window.crypto.subtle.encrypt(options, key, encoder.encode(text))),
        iv: pack(iv),
      })
    }

    return ''
  }

  static async getKey(budget: string) {
    const password = this.getPassword(budget)
    const digest = await window.crypto.subtle.digest({ name: 'SHA-256' }, encoder.encode(password!))
    return await window.crypto.subtle.importKey('raw', digest, ALGORITHM, false, ['encrypt', 'decrypt'])
  }

  static async decrypt(budget: string | undefined, encryptedText: string): Promise<string> {
    if (budget) {
      const password = this.getPassword(budget)

      if (password !== null) {
        return this._decryptWithPassword(password, encryptedText)
      }
    }

    return encryptedText
  }

  static async decrypt2(budget: string | undefined, encryptedText: string): Promise<string> {
    if (budget) {
      const { iv, cipher } = JSON.parse(encryptedText);
      const key = await this.getKey(budget);
      const options = {
        name: 'AES-GCM',
        iv: unpack(iv),
      };

      return decoder.decode(await window.crypto.subtle.decrypt(options, key, unpack(cipher)));
    }

    return encryptedText
  }

  private static async _decryptWithPassword(password: string, encryptedText: string): Promise<string> {
    try {
      const source = util.b64_to_Uint8Array(encryptedText)
      const plaintext = await openpgp.decrypt({
        message: await message.read(source),
        passwords: [password],
      })

      return plaintext.data as string
    } catch (e) {
      throw new Error('Invalid encryption password')
    }
  }
}
