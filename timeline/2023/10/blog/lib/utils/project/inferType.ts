import { modLoaders, pluginLoaders, shaderLoaders } from "../../services/project/index.t";

export function inferProjectType(
  files: { name: string; type: string }[] = [],
  loaders: string[] = [],
): string {
  const lowerLoaders = loaders.map((l) => l.toLowerCase());

  // 1. 先根据 loader 判断
  if (lowerLoaders.some((l) => modLoaders.includes(l))) return "mod";
  if (lowerLoaders.some((l) => shaderLoaders.includes(l))) return "shader";
  if (lowerLoaders.some((l) => pluginLoaders.includes(l))) return "plugin";

  // 2. 再根据文件 MIME 类型判断
  for (const file of files) {
    const mime = file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (mime === "application/x-modrinth-modpack+zip") return "modpack";
    if (mime === "application/java-archive" || ext === "jar") return "mod";
    if (["application/zip", "application/x-zip-compressed"].includes(mime)) {
      if (ext === "mcpack") return "resource pack";
      if (ext === "mcfunction" || ext === "datapack") return "datapack";
    }
    if (ext === "mcpack") return "resource pack";
    if (ext === "mcfunction" || ext === "datapack") return "datapack";
    if (ext === "shader" || ext === "fsh" || ext === "vsh") return "shader";
  }

  return "unknown";
}
