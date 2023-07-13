import { Vector3 } from 'three'

export interface Game {
  paddle1Pos: Vector3
  paddle2Pos: Vector3
  testBallPos: Vector3
  score1: number
  score2: number
  isUserPaddle1: boolean
}
