import type { Channel } from './Channel'
import type { Friendship } from './Friendship'

export interface User {
  // ******************* //
  // USER AUTHENTICATION //
  // ******************* //

  id: string
  username: string
  password: string
  profilePicture: string
  isTwoFactorEnabled: boolean

  // ****************** //
  // OTHER INFORMATIONS //
  // ****************** //

  status: string

  // ******************************* //
  // FRIENDSHIP RELATED INFORMATIONS //
  // ******************************* //

  friends: Array<User>
  nFriends: number
  sentRequest: Array<Friendship>
  receivedRequest: Array<Friendship>
  isBlockedBy: boolean

  // ************************* //
  // CHAT RELATED INFORMATIONS //
  // ************************* //

  channels: Array<Channel>
  bannedChannels: Array<Channel>
  messages: Array<Message>

  // ************************** //
  // STATS RELATED INFORMATIONS //
  // ************************** //

  rank: number
  gamesPlayed: number
  win: number
  loss: number
  winRate: number
  pointsScored: number
  pointsConceded: number
  pointsDifference: number
}
