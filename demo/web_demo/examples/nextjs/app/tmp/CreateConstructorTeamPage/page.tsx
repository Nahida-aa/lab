"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, AlertCircle, Wrench, HardHat } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateConstructorTeamPage() {
  const router = useRouter()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [teamName, setTeamName] = useState("")
  const [teamUrl, setTeamUrl] = useState("")
  const [teamSlogan, setTeamSlogan] = useState("")
  const [teamGoal, setTeamGoal] = useState("")
  const [teamIntro, setTeamIntro] = useState("")
  const [teamCulture, setTeamCulture] = useState("")
  const [recruitingStatus, setRecruitingStatus] = useState("")
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [servicePlan, setServicePlan] = useState("")
  const [teamSpecialty, setTeamSpecialty] = useState("")

  const [hasMembership] = useState(false)

  // 施工服务类型
  const constructionServices = [
    "Java 模组开发",
    "Fabric/Forge 框架开发",
    "数据包开发",
    "命令方块工程",
    "红石电路设计",
    "大型建筑施工",
    "精细建筑装饰",
    "3D 模型制作",
    "材质绘制设计",
    "光影程序开发",
    "服务器插件开发",
    "地图场景制作",
    "音效设计",
    "UI 界面设计",
    "性能优化服务",
    "多语言翻译",
    "测试与调试",
    "技术文档编写",
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleServiceType = (type: string) => {
    setServiceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleSubmit = () => {
    console.log("Creating constructor team:", {
      teamName,
      teamUrl,
      teamSlogan,
      teamGoal,
      teamCulture,
      recruitingStatus,
      serviceTypes,
      servicePlan,
      teamSpecialty,
      teamIntro,
    })
    router.push("/hr-hub")
  }

  const isFormValid =
    teamName.trim() && teamUrl.trim() && teamSlogan.trim() && teamGoal.trim() && teamCulture.trim() && logoPreview && serviceTypes.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hr-hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回平台人力
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <HardHat className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">成立施工团队</h1>
              <p className="text-muted-foreground">组建专业的项目执行团队，承接创作者的项目需求</p>
            </div>
          </div>

          {/* Team Type Description */}
          <div className="mb-8 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-orange-500">施工团队说明</p>
                <p className="text-muted-foreground">
                  施工团队是专业的项目执行团队，负责将创作者的想法和设计方案最终实现。
                  施工团队需要具备实际的技术开发、建筑施工、美术制作等能力，能够按照创作者的要求完成项目交付。
                </p>
              </div>
            </div>
          </div>

          {/* Membership Info */}
          <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-blue-500">会员权益说明</p>
                {hasMembership ? (
                  <div className="text-muted-foreground space-y-1">
                    <p>您已开通施工者会员，享有以下权益：</p>
                    <p className="ml-4">- 可以成立或加入最多 30 人的施工团队</p>
                    <p className="ml-4">- 可以同时承接最多 15 个项目</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground space-y-1">
                    <p>- 未开通会员：可成立或加入最多 5 人施工团队，同时承接最多 5 个项目</p>
                    <p>- 开通会员：可成立或加入最多 30 人施工团队，同时承接最多 15 个项目</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* 团队标识徽章 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                团队标识徽章
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {logoPreview ? (
                    <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-orange-500/50 overflow-hidden">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Team logo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setLogoPreview(null)}
                        className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-orange-500/30 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors bg-orange-500/5">
                      <Upload className="h-6 w-6 text-orange-500 mb-1" />
                      <span className="text-xs text-orange-500">上传</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>推荐尺寸：200x200px</p>
                  <p>支持格式：JPG, PNG, GIF</p>
                </div>
              </div>
            </div>

            {/* 团队名称 */}
            <div className="space-y-3">
              <Label htmlFor="team-name" className="text-base font-semibold flex items-center gap-2">
                团队名称
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-name"
                placeholder="输入施工团队名称（3-20字符）"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={20}
                className="text-base"
              />
              <div className="text-xs text-muted-foreground text-right">{teamName.length}/20</div>
            </div>

            {/* 团队URL */}
            <div className="space-y-3">
              <Label htmlFor="team-url" className="text-base font-semibold flex items-center gap-2">
                团队URL
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-url"
                placeholder="https://platform.com/constructor-team/your-team"
                value={teamUrl}
                onChange={(e) => setTeamUrl(e.target.value)}
                className="text-base font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">团队专属访问地址，创建后不可修改</p>
            </div>

            {/* 团队一句话标语 */}
            <div className="space-y-3">
              <Label htmlFor="team-slogan" className="text-base font-semibold flex items-center gap-2">
                团队一句话标语
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-slogan"
                placeholder="用一句话描述团队的技术实力（20-50字符）"
                value={teamSlogan}
                onChange={(e) => setTeamSlogan(e.target.value)}
                maxLength={50}
                className="text-base"
              />
              <div className="text-xs text-muted-foreground text-right">{teamSlogan.length}/50</div>
            </div>

            {/* 团队成立目标 */}
            <div className="space-y-3">
              <Label htmlFor="team-goal" className="text-base font-semibold flex items-center gap-2">
                团队成立目标
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Textarea
                id="team-goal"
                placeholder="详细描述团队的成立目标和服务宗旨（100-500字符）"
                value={teamGoal}
                onChange={(e) => setTeamGoal(e.target.value)}
                maxLength={500}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamGoal.length}/500</div>
            </div>

            {/* 团队技术专长 */}
            <div className="space-y-3">
              <Label htmlFor="team-specialty" className="text-base font-semibold flex items-center gap-2">
                团队核心技术专长
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Textarea
                id="team-specialty"
                placeholder="描述团队的核心技术优势和专长领域（如：精通大型模组开发、擅长高精度建筑还原、红石工程专家团队等）"
                value={teamSpecialty}
                onChange={(e) => setTeamSpecialty(e.target.value)}
                maxLength={300}
                rows={4}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamSpecialty.length}/300</div>
            </div>

            {/* 团队文化氛围 */}
            <div className="space-y-3">
              <Label htmlFor="team-culture" className="text-base font-semibold flex items-center gap-2">
                团队文化氛围
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Textarea
                id="team-culture"
                placeholder="描述团队的工作风格和文化氛围（如：高效执行、精益求精、团队协作、技术至上等）"
                value={teamCulture}
                onChange={(e) => setTeamCulture(e.target.value)}
                maxLength={200}
                rows={3}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamCulture.length}/200</div>
            </div>

            {/* 可提供的施工服务类型 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                可提供的施工服务
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-orange-400 mb-3">选择团队可以承接的服务类型，这将帮助创作者找到合适的施工合作伙伴</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {constructionServices.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={serviceTypes.includes(type)}
                      onCheckedChange={() => toggleServiceType(type)}
                    />
                    <label
                      htmlFor={type}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 团队服务计划 */}
            <div className="space-y-3">
              <Label htmlFor="service-plan" className="text-base font-semibold flex items-center gap-2">
                团队服务计划
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400">描述团队的服务能力和未来发展规划</p>
              </div>
              <Textarea
                id="service-plan"
                placeholder="例如：计划在未来一年内扩充团队技术栈，增加光影开发能力；提升项目交付效率，目标月均完成3个中型项目..."
                value={servicePlan}
                onChange={(e) => setServicePlan(e.target.value)}
                maxLength={1000}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{servicePlan.length}/1000</div>
            </div>

            {/* 团队简介 */}
            <div className="space-y-3">
              <Label htmlFor="team-intro" className="text-base font-semibold flex items-center gap-2">
                团队简介
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <Textarea
                id="team-intro"
                placeholder="更详细的团队介绍，可以包含团队历史、成功案例等"
                value={teamIntro}
                onChange={(e) => setTeamIntro(e.target.value)}
                maxLength={1000}
                rows={4}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamIntro.length}/1000</div>
            </div>

            {/* 招募状态 */}
            <div className="space-y-3">
              <Label htmlFor="recruiting-status" className="text-base font-semibold flex items-center gap-2">
                招募状态
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <Textarea
                id="recruiting-status"
                placeholder="描述当前的招募情况（如：招募有经验的模组开发者、需要精通红石的技术人员、暂不招募等）"
                value={recruitingStatus}
                onChange={(e) => setRecruitingStatus(e.target.value)}
                maxLength={200}
                rows={3}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{recruitingStatus.length}/200</div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 mt-10 pt-6 border-t border-border">
            <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={() => router.back()}>
              取消
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              成立施工团队
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
