// hooks/useMinecraftVersions.ts
import useSWR from "swr"
import type { McManifest } from "@/app/data/minecraft-versions/route"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const useMinecraftManifest = () => {
  const { data, error, isLoading } = useSWR<McManifest>("/data/minecraft-versions", fetcher, {
    refreshInterval: 1800000, // 30分钟自动刷新
    revalidateOnFocus: false, // 切换标签页时不重新请求
  })

  return {
    versions: data?.versions,
    latest: data?.latest,
    isLoading,
    error,
  }
}
