export type ActivityScore = {
  activity: string
  score: number
}

export type RankingByDay = {
  date: string
  ranking: ActivityScore[]
}

export type RankingError = {
  error: string
  details?: string
}

export type Location = {
  city: string
  country: string
  latitude: number
  longitude: number
}
