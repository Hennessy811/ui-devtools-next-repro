export interface Page {
  current: number
  last: number
  total_objects: number
  next_uri: string | null
  previous_uri: string | null
  last_uri: string | null
}
