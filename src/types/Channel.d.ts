import type { User } from './User'

export interface Channel {
  // **************************** //
  // GENERAL CHANNEL INFORMATIONS //
  // **************************** //
  id: string
  name: string
  dmUser?: User
  isDm: boolean
  image: string
  unreadMessages: number

  // **************************** //
  // MEMBERS RELATED INFORMATIONS //
  // **************************** //

  owner: User
  members: User[]
  admins: User[]
  bannedMembers: User[]
  kickedMembers: User[]
  mutedMembers: User[]

  // **************************** //
  // PRIVACY RELATED INFORMATIONS //
  // **************************** //
  passwordRequired: boolean
  password: string

  // ***************************** //
  // MESSAGES RELATED INFORMATIONS //
  // ***************************** //
  messages: Message[]
}
