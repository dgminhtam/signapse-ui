export type CronjobStatus = "RUNNING" | "PAUSED" | "COMPLETE" | "SCHEDULED"

export interface CronjobRequest {
  jobName: string
  jobGroup: string
  jobClass: string
  expression: string
  description?: string
}

export interface CronjobResponse {
  id: number
  jobName: string
  jobGroup: string
  jobClass: string
  jobStatus: CronjobStatus
  cronExpression: string
  description: string
  expressionDescription: string
  nextTriggeredTime?: string
}

export interface CronjobListResponse {
  id: number
  jobName: string
  jobGroup: string
  jobClass: string
  jobStatus: CronjobStatus
  cronExpression: string
  description: string
  expressionDescription: string
  nextTriggeredTime?: string
}
