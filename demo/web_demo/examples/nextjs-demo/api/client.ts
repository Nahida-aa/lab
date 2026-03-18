import { hc } from "hono/client"
import { AppType, ErrRes } from "./app"

// const api = hc<AppType>('/api').api // Typed correctly

export const api = hc<AppType>('/api').api

const res = await api.demo.$post({
  json: {
    name: 'hello',
  },
  query: {
    limit: String(10),
  },
})
if (!res.ok) {
  const err = await res.json() as unknown as ErrRes
}
// api