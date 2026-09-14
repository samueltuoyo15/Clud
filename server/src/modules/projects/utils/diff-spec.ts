import openapiDiff from 'openapi-diff'

export interface DiffResult {
  breakingChanges: unknown[]
  nonBreakingChanges: unknown[]
  unclassifiedChanges: unknown[]
  breakingChangesFound: boolean
}

export async function computeSpecDiff(previousSpecStr: string, newSpecStr: string): Promise<DiffResult> {
  const oldSpecObj = JSON.parse(previousSpecStr) as Record<string, unknown>
  const newSpecObj = JSON.parse(newSpecStr) as Record<string, unknown>

  const oldFormat = typeof oldSpecObj.swagger === 'string' ? 'swagger2' : 'openapi3'
  const newFormat = typeof newSpecObj.swagger === 'string' ? 'swagger2' : 'openapi3'

  const result = await openapiDiff.diffSpecs({
    sourceSpec: {
      content: previousSpecStr,
      location: 'previous',
      format: oldFormat,
    },
    destinationSpec: {
      content: newSpecStr,
      location: 'current',
      format: newFormat,
    },
  })

  return {
    breakingChanges: result.breakingDifferencesFound ? result.breakingDifferences : [],
    nonBreakingChanges: result.nonBreakingDifferences ?? [],
    unclassifiedChanges: result.unclassifiedDifferences ?? [],
    breakingChangesFound: result.breakingDifferencesFound,
  }
}
