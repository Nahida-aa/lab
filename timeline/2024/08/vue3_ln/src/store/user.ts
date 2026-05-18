// src/store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    score_count: 0,
    download_count: 0
  }),
  actions: {
    updateScoreCount(newCount: number) {
      this.score_count = newCount
    },
    updateDownloadCount(newCount: number) {
      this.download_count = newCount
    }
  }
})