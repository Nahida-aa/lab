"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, AlertCircle, Coins, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateInvestorTeamPage() {
  const router = useRouter()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [teamName, setTeamName] = useState("")
  const [teamUrl, setTeamUrl] = useState("")
  const [teamSlogan, setTeamSlogan] = useState("")
  const [teamGoal, setTeamGoal] = useState("")
  const [teamIntro, setTeamIntro] = useState("")
  const [teamCulture, setTeamCulture] = useState("")
  const [recruitingStatus, setRecruitingStatus] = useState("")
  const [investmentFocus, setInvestmentFocus] = useState<string[]>([])
  const [investmentPlan, setInvestmentPlan] = useState("")
  const [investmentExpectation, setInvestmentExpectation] = useState("")

  const [hasMembership] = useState(false)

  // 投资关注的内容类型
  const contentTypes = [
    "模组（功能模组）",
    "模组（优化模组）",
    "整合包",
    "材质包",
    "地图（生存地图）",
    "地图（冒险地图）",
    "地图（解谜地图）",
    "地图（跑酷地图）",
    "地图（建筑地图）",
    "皮肤",
    "数据包",
    "光影包",
    "服务器插件",
    "建筑作品",
    "命令方块作品",
    "创意内容",
  ]

  // 投资风格偏好
  const stylePreferences = [
    "写实风格",
    "卡通风格",
    "像素风格",
    "科幻风格",
    "奇幻风格",
    "中世纪风格",
    "现代都市风格",
    "东方风格",
    "恐怖风格",
    "休闲娱乐风格",
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

  const toggleFocus = (type: string) => {
    setInvestmentFocus((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleSubmit = () => {
    console.log("Creating investor team:", {
      teamName,
      teamUrl,
      teamSlogan,
      teamGoal,
      teamCulture,
      recruitingStatus,
      investmentFocus,
      investmentPlan,
      investmentExpectation,
      teamIntro,
    })
    router.push("/hr-hub")
  }

  const isFormValid =
    teamName.trim() && teamUrl.trim() && teamSlogan.trim() && teamGoal.trim() && teamCulture.trim() && logoPreview && investmentFocus.length > 0

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
            <div className="p-3 rounded-lg bg-amber-500/20">
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">成立投资团队</h1>
              <p className="text-muted-foreground">汇聚投资者力量，共同推动优质内容的产出</p>
            </div>
          </div>

          {/* Team Type Description */}
          <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Coins className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-amber-500">投资团队说明</p>
                <p className="text-muted-foreground">
                  投资团队是由多位投资者组成的资金联合体，通过集中资源支持大型项目开发、定制高质量内容。
                  投资团队可以共同出资赞助创作者项目、参与众筹、定制专属内容，实现更大规模的投资影响力。
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
                    <p>您已开通投资者会员，享有以下权益：</p>
                    <p className="ml-4">- 可以成立或加入最多 30 人的投资团队</p>
                    <p className="ml-4">- 可以同时参与最多 15 个投资项目</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground space-y-1">
                    <p>- 未开通会员：可成立或加入最多 5 人投资团队，同时参与最多 5 个投资项目</p>
                    <p>- 开通会员：可成立或加入最多 30 人投资团队，同时参与最多 15 个投资项目</p>
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
                    <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-amber-500/50 overflow-hidden">
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
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-amber-500/30 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-colors bg-amber-500/5">
                      <Upload className="h-6 w-6 text-amber-500 mb-1" />
                      <span className="text-xs text-amber-500">上传</span>
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
                placeholder="输入投资团队名称（3-20字符）"
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
                placeholder="https://platform.com/investor-team/your-team"
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
                placeholder="用一句话描述团队的投资理念（20-50字符）"
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
                placeholder="详细描述团队的成立目标和投资愿景（100-500字符）"
                value={teamGoal}
                onChange={(e) => setTeamGoal(e.target.value)}
                maxLength={500}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamGoal.length}/500</div>
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
                placeholder="描述团队的投资风格和文化氛围（如：理性投资、支持原创、鼓励创新等）"
                value={teamCulture}
                onChange={(e) => setTeamCulture(e.target.value)}
                maxLength={200}
                rows={3}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{teamCulture.length}/200</div>
            </div>

            {/* 投资关注方向 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                投资关注方向
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-400 mb-3">选择团队重点关注和愿意投资的内容类型</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {contentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`focus-${type}`}
                      checked={investmentFocus.includes(type)}
                      onCheckedChange={() => toggleFocus(type)}
                    />
                    <label
                      htmlFor={`focus-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 偏好的风格 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">偏好的风格题材</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stylePreferences.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={investmentFocus.includes(style)}
                      onCheckedChange={() => toggleFocus(style)}
                    />
                    <label
                      htmlFor={`style-${style}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 投资期望 */}
            <div className="space-y-3">
              <Label htmlFor="investment-expectation" className="text-base font-semibold flex items-center gap-2">
                投资期望
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-400">描述团队希望推动产出什么样的内容，对创作者有什么期望</p>
              </div>
              <Textarea
                id="investment-expectation"
                placeholder="例如：希望平台能够产出更多高质量的大型冒险地图、支持原创模组开发、推动更精美的材质包制作..."
                value={investmentExpectation}
                onChange={(e) => setInvestmentExpectation(e.target.value)}
                maxLength={1000}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{investmentExpectation.length}/1000</div>
            </div>

            {/* 团队投资计划 */}
            <div className="space-y-3">
              <Label htmlFor="investment-plan" className="text-base font-semibold flex items-center gap-2">
                团队投资计划
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400">描述团队的投资规划和资金安排</p>
              </div>
              <Textarea
                id="investment-plan"
                placeholder="例如：计划每季度投资3-5个优质项目、设立新人创作者扶持基金、长期赞助特定类型的内容开发..."
                value={investmentPlan}
                onChange={(e) => setInvestmentPlan(e.target.value)}
                maxLength={1000}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{investmentPlan.length}/1000</div>
            </div>

            {/* 预期投资规模 */}
            <div className="space-y-3">
              <Label htmlFor="investment-scale" className="text-base font-semibold flex items-center gap-2">
                预期投资规模
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <Select>
                <SelectTrigger id="investment-scale" className="w-full">
                  <SelectValue placeholder="请选择团队预期的月投资规模" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000-5000">¥1,000 - ¥5,000 / 月</SelectItem>
                  <SelectItem value="5000-10000">¥5,000 - ¥10,000 / 月</SelectItem>
                  <SelectItem value="10000-50000">¥10,000 - ¥50,000 / 月</SelectItem>
                  <SelectItem value="50000-100000">¥50,000 - ¥100,000 / 月</SelectItem>
                  <SelectItem value="100000+">¥100,000 以上 / 月</SelectItem>
                  <SelectItem value="flexible">灵活安排</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="更详细的团队介绍，可以包含团队成员背景、投资理念、成功投资案例等"
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
                placeholder="描述当前的招募情况（如：欢迎志同道合的投资者加入、暂时不招募新成员等）"
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
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              成立投资团队
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
