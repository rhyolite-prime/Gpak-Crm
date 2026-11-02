import type { FinishedArtefactSize } from '~/models'

/** The estimate API stores size as a string, not an artefact-size ID. */
export function formatFinishedArtefactSize(size: Pick<FinishedArtefactSize, 'alias' | 'length' | 'width' | 'unit'>): string {
  const dimensions = `${size.length} × ${size.width} ${size.unit}`.trim()
  return size.alias?.trim() ? `${size.alias.trim()} (${dimensions})` : dimensions
}

type SizePage = { data: FinishedArtefactSize[]; totalPages?: number }
export async function fetchAllFinishedArtefactSizes(fetchPage: (query: { pageNo: number; pageSize: number }) => Promise<SizePage>): Promise<FinishedArtefactSize[]> {
  const pageSize = 100
  const first = await fetchPage({ pageNo: 1, pageSize })
  if (!first || !Array.isArray(first.data)) throw new Error('Invalid finished artefact sizes response')
  const totalPages = first.totalPages ?? 1
  if (!Number.isSafeInteger(totalPages) || totalPages < 0) throw new Error('Invalid finished artefact sizes pagination')
  const all = [...first.data]
  for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
    const page = await fetchPage({ pageNo, pageSize })
    if (!page || !Array.isArray(page.data)) throw new Error('Invalid finished artefact sizes response')
    all.push(...page.data)
  }
  return all
}
