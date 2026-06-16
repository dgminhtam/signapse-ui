export interface MailServiceResponse {
  email: string
  provider: string
  password?: string
  is_default: boolean
}

export interface MailServiceRecord {
  email: string
  provider: string
  password?: string
  isDefault: boolean
}

export interface MailServiceSaveRequest {
  email: string
  provider: string
  password: string
  is_default: boolean
}

export function normalizeMailServiceRecord(
  record: MailServiceResponse
): MailServiceRecord {
  return {
    email: record.email,
    password: record.password,
    provider: record.provider,
    isDefault: record.is_default,
  }
}
