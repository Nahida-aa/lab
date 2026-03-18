import { NextResponse } from "next/server"
type Manifest = {
  latest: {
    release: string
    snapshot: string
  }
  versions: Array<{
    id: string
    type: string
    url: string
    time: string
    releaseTime: string
    sha1: string
    complianceLevel: number
  }>
}
export type McManifest = {
  latest: {
    release: string
    snapshot: string
  }
  versions: Array<{
    id: string
    type: string
    releaseTime: string
  }>
}
// 缓存版本信息，避免频繁请求Mojang API
let cachedManifest: McManifest | null = null
let lastFetch = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30分钟缓存

export const GET = async () => {
  try {
    const now = Date.now()

    // 如果缓存存在且未过期，直接返回缓存
    if (cachedManifest && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(cachedManifest)
    }

    // 获取版本清单
    const manifestResponse = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
    if (!manifestResponse.ok) {
      throw new Error("Failed to fetch version manifest")
    }

    const manifest = await manifestResponse.json() as Manifest

    // 保留需要的信息
    const versions = manifest.versions.map((version) => ({
      id: version.id,
      // type: version.type,
      type:
        version.type === "release"
          ? "release"
          : version.type === "snapshot"
            ? "snapshot"
            : version.type.startsWith("old_") // old_alpha\beta -> alpha\beta
              ? version.type.substring(4)
              : "other",
      releaseTime: version.releaseTime,
    }))

    const result = {
      latest: manifest.latest,
      versions,
    }

    // 更新缓存
    cachedManifest = result
    lastFetch = now

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching Minecraft versions:", error)

    // 如果有缓存数据，即使过期也返回，避免完全失败
    if (cachedManifest) {
      return NextResponse.json(cachedManifest)
    }

    return NextResponse.json({ error: "Failed to fetch Minecraft versions" }, { status: 500 })
  }
}
