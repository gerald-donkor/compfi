export type PublicSubmissionGuard = {
  website?: string
}

export function isLikelyAutomatedSubmission(guard?: PublicSubmissionGuard): boolean {
  return Boolean(guard?.website?.trim())
}
