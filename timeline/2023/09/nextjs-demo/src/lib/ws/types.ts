export type OnlineStatus = 'online' | 'idle' | 'dnd' | 'invisible' | 'offline'
export type OnlineStatuses = {
  [userId: string]: OnlineStatus
}