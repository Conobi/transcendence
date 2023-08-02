import { User } from './User'

export enum RoomStatus {
  OPEN = 'open',
  FULL = 'full',
  INGAME = 'ingame'
}

export interface Room {
  id: string
  name: string
  players: User[]
  owner: User
  isPrivate: boolean
  paddleRatio: number
  gameDuration: number
  ballSpeed: number
  status: RoomStatus
}
