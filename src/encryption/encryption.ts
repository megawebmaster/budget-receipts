import openpgp, { message, util } from 'openpgp'
import { of } from 'rxjs'
import { mergeAll } from 'rxjs/operators'
import { AfterAction, requirePassword } from '../components/password-requirement'
import { append, uniq } from 'ramda'

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

  static removePassword(budget: string): void {
    localStorage.removeItem(`encryption-password-${budget}`)
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
      const password = this.getPassword(budget)
      const encrypted = await openpgp.encrypt({
        message: message.fromText(text),
        passwords: [password],
        armor: false,
      })
      const result = encrypted.message.packets.write() as Uint8Array

      return util.Uint8Array_to_b64(result)
    }

    return ''
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

  private static async _decryptWithPassword(password: string, encryptedText: string): Promise<string> {
    try {
      const source = util.b64_to_Uint8Array(encryptedText)
      const plaintext = await openpgp.decrypt({
        message: await message.read(source),
        passwords: [password],
      })

      return plaintext.data as string
    } catch (e) {
      throw new EncryptionError()
    }
  }
}

export const handleEncryptionError = (budget: string, action: AfterAction) =>
  (error: Error) => {
    if (error instanceof EncryptionError) {
      Encryption.removePassword(budget)

      return of([
        // requirePasswordError('errors.invalid-encryption-password'),
        requirePassword(action),
      ]).pipe(
        mergeAll(),
      )
    }

    throw error
  }
