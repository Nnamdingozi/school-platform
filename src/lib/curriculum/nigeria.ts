// src/lib/curriculum/nigeria.ts

export type NigerianStream = 'science' | 'arts' | 'commercial' | 'trade'

export function classifyNigerianSubject(
  subjectName: string,
  isJSS: boolean
): { isCompulsory: boolean; stream: NigerianStream | null } {

  if (isJSS) return { isCompulsory: true, stream: null }

  const name = subjectName.toLowerCase().trim()

  const coreSubjects = [
    'english studies',
    'mathematics',
    'social and citizenship studies',
    'citizenship and heritage studies'
  ]

  const scienceSubjects = [
    'physics',
    'chemistry',
    'biology',
    'further mathematics',
    'agricultural science',
    'geography'
  ]

  const artsSubjects = [
    'government',
    'christian religious studies',
    'nigerian history'
  ]

  const commercialSubjects = [
    'commerce',
    'financial accounting',
    'economics',
    'marketing'
  ]

  const tradeSubjects = [
    'beauty and cosmetology',
    'catering and craft practice',
    'computer hardware and gsm repairs',
    'digital technologies',
    'fashion design and garment making',
    'food and nutrition',
    'horticulture and crop production',
    'livestock farming',
    'solar photovoltaic installation and maintenance',
    'technical drawing'
  ]

  const isCompulsory = coreSubjects.some(s => name.includes(s))

  let stream: NigerianStream | null = null

  if (scienceSubjects.some(s => name.includes(s))) stream = 'science'
  else if (artsSubjects.some(s => name.includes(s))) stream = 'arts'
  else if (commercialSubjects.some(s => name.includes(s))) stream = 'commercial'
  else if (tradeSubjects.some(s => name.includes(s))) stream = 'trade'

  return { isCompulsory, stream }
}