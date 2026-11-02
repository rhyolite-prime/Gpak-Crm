// A versioned snapshot carried as a JSON object in EstimationVariable.value.
// Keep row IDs and percentageTarget values unchanged across a round trip.
export const ESTIMATE_SNAPSHOT_KEY = 'newEstimateSnapshot'
export const ESTIMATE_SNAPSHOT_VERSION = 1

type Variable = { systemName?: string; value?: unknown }
export type EstimateSnapshot = {
  version: 1
  form: Record<string, any> & { tableRows: any[]; summaries: any[] }
  finishingSelection: Record<string, any>
  finishingPrices: Record<string, any>
  productionRequest: Record<string, any> | null
  productionRequestId: string
}

export function buildEstimateSnapshot(form: EstimateSnapshot['form'], finishingSelection: Record<string, any>, finishingPrices: Record<string, any>, productionRequest: Record<string, any> | null, productionRequestId: string): EstimateSnapshot {
  return { version: ESTIMATE_SNAPSHOT_VERSION, form, finishingSelection, finishingPrices, productionRequest, productionRequestId }
}

export function readEstimateSnapshot(variables: Variable[]): EstimateSnapshot | null {
  const variable = variables.find(item => item.systemName === ESTIMATE_SNAPSHOT_KEY)
  if (!variable) return null
  if (variable.value == null || variable.value === '') throw new Error('The saved estimate snapshot is missing or invalid.')
  let snapshot: any = variable.value
  // Compatibility with estimates saved before native JSON values were introduced.
  if (typeof snapshot === 'string') {
    try { snapshot = JSON.parse(snapshot) } catch { throw new Error('The saved estimate snapshot is invalid or truncated.') }
  }
  if (snapshot?.version !== ESTIMATE_SNAPSHOT_VERSION) throw new Error('This estimate snapshot version is not supported.')
  if (!snapshot.form || typeof snapshot.form !== 'object' || !Array.isArray(snapshot.form.tableRows) || !Array.isArray(snapshot.form.summaries) || !snapshot.finishingSelection || typeof snapshot.finishingSelection !== 'object' || !snapshot.finishingPrices || typeof snapshot.finishingPrices !== 'object') {
    throw new Error('The saved estimate snapshot is incomplete.')
  }
  const requiredFormKeys = ['templateType', 'date', 'noOfCoverSides', 'client', 'jobName', 'quantity', 'size', 'pages', 'pagesToView', 'pagesOut', 'noOfColoursCover', 'noOfColoursText', 'noOfCoversPerSheet', 'noOfInsidePlates', 'noOfCoverPlates', 'wasteFactor', 'summaries', 'tableRows', 'marginPercentage', 'taxPercentage']
  if (requiredFormKeys.some(key => !Object.hasOwn(snapshot.form, key)) || !['bookwork', 'labels', 'packaging'].includes(snapshot.form.templateType) || typeof snapshot.productionRequestId !== 'string' || snapshot.form.tableRows.some((row: any) => !row || typeof row.id !== 'string' || !row.id || typeof row.category !== 'string' || typeof row.description !== 'string') || new Set(snapshot.form.tableRows.map((row: any) => row.id)).size !== snapshot.form.tableRows.length) {
    throw new Error('The saved estimate snapshot is incomplete.')
  }
  return snapshot as EstimateSnapshot
}

export function isNewEstimate(variables: Variable[] | undefined): boolean {
  return Array.isArray(variables) && variables.some(variable => variable.systemName === ESTIMATE_SNAPSHOT_KEY || variable.systemName === 'estimateRows')
}

/** Older estimates stored complex variable values as JSON strings. */
export function readComplexVariable(value: unknown): unknown {
  if (typeof value !== 'string') return value
  return JSON.parse(value)
}
