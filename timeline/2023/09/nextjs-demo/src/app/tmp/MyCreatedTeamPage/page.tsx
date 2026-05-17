"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  AlertCircle,
  Upload,
  X,
  Crown,
  Shield,
  UserCheck,
  UserPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Plus,
  FileText,
  Image,
  Code,
  Search,
  Users,
  ChevronRight,
  Settings,
  UserX,
  ArrowUp,
  ArrowDown,
  Clock,
  Check,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function MyCreatedTeamPage() {
  const [hasTeam] = useState(true)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchMember, setSearchMember] = useState("")
  const [activeWorkTab, setActiveWorkTab] = useState("all")

  // User's created teams list
  const myCreatedTeams = [
    {
      id: 1,
      name: "像素工坊",
      logo: null,
      slogan: "用像素构建无限可能",
      memberCount: 5,
      projectCount: 4,
      createdDate: "2024-06-15",
    },
    {
      id: 2,
      name: "红石实验室",
      logo: null,
      slogan: "探索红石的无限可能",
      memberCount: 8,
      projectCount: 7,
      createdDate: "2024-08-20",
    },
    {
      id: 3,
      name: "建筑大师联盟",
      logo: null,
      slogan: "匠心筑梦，创造传奇",
      memberCount: 12,
      projectCount: 15,
      createdDate: "2024-09-10",
    },
  ]

  const [teamInfo, setTeamInfo] = useState({
    name: "像素工坊",
    url: "https://platform.com/team/pixel-workshop",
    slogan: "用像素构建无限可能",
    goal: "致力于打造高品质的 Minecraft 建筑和材质资源，为玩家提供沉浸式的游戏体验。我们希望汇聚一批热爱建筑和美术的创作者，共同创作出令人惊叹的游戏内容。",
    culture: "轻松愉快、鼓励创新、互相学习、共同进步",
    recruiting: "长期招募建筑师和材质画师，要求有至少一个完整作品",
    intro: "像素工坊成立于2024年，是一个专注于 Minecraft 视觉内容创作的团队。",
    creationDirection: ["材质包", "建筑作品", "光影包", "地图（建筑地图）"],
    creationPlan: "计划在未来半年内推出一套完整的中世纪主题材质包和配套的建筑地图。",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [members, setMembers] = useState([
    { id: 1, name: "用户8947", role: "团队成立者", joinDate: "2024-06-15", avatar: "F", status: "在线", title: "创始人" },
    { id: 2, name: "建筑大师", role: "管理者", joinDate: "2024-07-02", avatar: "建", status: "在线", title: "建筑总监" },
    { id: 3, name: "红石工程师", role: "正式团员", joinDate: "2025-01-20", avatar: "红", status: "离线", title: "技术骨干" },
    { id: 4, name: "材质画师", role: "正式团员", joinDate: "2025-08-05", avatar: "材", status: "在线", title: "美术组长" },
    { id: 5, name: "新手小白", role: "意向团员", joinDate: "2025-09-10", avatar: "新", status: "离线", title: "" },
  ])

  // Role title settings
  const [roleTitles, setRoleTitles] = useState({
    团队成立者: "创始人",
    管理者: "管理员",
    正式团员: "正式成员",
    意向团员: "实习成员",
  })
  const [isEditingTitles, setIsEditingTitles] = useState(false)

  // Member action states
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showKickDialog, setShowKickDialog] = useState(false)
  const [showTitleDialog, setShowTitleDialog] = useState(false)
  const [editingMemberTitle, setEditingMemberTitle] = useState("")

  // Calculate if a member can be promoted
  const canPromote = (member: typeof members[0]) => {
    const joinDate = new Date(member.joinDate)
    const now = new Date()
    const monthsDiff = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth())
    
    if (member.role === "意向团员") {
      // 意向团员加入半年后才能转正为正式团员
      return monthsDiff >= 6
    } else if (member.role === "正式团员") {
      // 正式团员一年后可以被设置为管理者
      return monthsDiff >= 12
    }
    return false
  }

  const getPromotionInfo = (member: typeof members[0]) => {
    const joinDate = new Date(member.joinDate)
    const now = new Date()
    const monthsDiff = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth())
    
    if (member.role === "意向团员") {
      if (monthsDiff < 6) {
        return `还需 ${6 - monthsDiff} 个月才能转正`
      }
      return "可转正为正式团员"
    } else if (member.role === "正式团员") {
      if (monthsDiff < 12) {
        return `还需 ${12 - monthsDiff} 个月才能晋升`
      }
      return "可晋升为管理者"
    }
    return ""
  }

  const handlePromote = (memberId: number) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        if (m.role === "意向团员") {
          return { ...m, role: "正式团员" }
        } else if (m.role === "正式团员") {
          return { ...m, role: "管理者" }
        }
      }
      return m
    }))
    setShowRoleDialog(false)
    setSelectedMemberId(null)
  }

  const handleDemote = (memberId: number) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        if (m.role === "管理者") {
          return { ...m, role: "正式团员" }
        }
      }
      return m
    }))
    setShowRoleDialog(false)
    setSelectedMemberId(null)
  }

  const handleKick = (memberId: number) => {
    setMembers(members.filter(m => m.id !== memberId))
    setShowKickDialog(false)
    setSelectedMemberId(null)
  }

  const handleUpdateMemberTitle = (memberId: number, newTitle: string) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        return { ...m, title: newTitle }
      }
      return m
    }))
    setShowTitleDialog(false)
    setSelectedMemberId(null)
    setEditingMemberTitle("")
  }

  const works = [
    { id: 1, name: "中世纪城堡地图", type: "地图（建筑地图）", status: "已发布", date: "2024-08-15", downloads: 1243 },
    { id: 2, name: "像素工坊材质包 v2.0", type: "材质包", status: "已发布", date: "2024-09-01", downloads: 3567 },
    { id: 3, name: "奇幻光影包", type: "光影包", status: "审核中", date: "2024-10-12", downloads: 0 },
    { id: 4, name: "古风建筑合集", type: "建筑作品", status: "草稿", date: "2024-10-20", downloads: 0 },
  ]

  const contentTypes = [
    "模组（功能模组）", "模组（优化模组）", "模组（辅助模组）", "整合包",
    "材质包", "地图（生存地图）", "地图（冒险地图）", "地图（解谜地图）",
    "地图（跑酷地图）", "地图（建筑地图）", "皮肤", "数据包",
    "服务器插件", "建筑作品", "光影包", "声音包", "命令方块作品", "创意内容",
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "团队成立者":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
            <Crown className="h-3 w-3" />
            {role}
          </Badge>
        )
      case "管理者":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1">
            <Shield className="h-3 w-3" />
            {role}
          </Badge>
        )
      case "正式团员":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
            <UserCheck className="h-3 w-3" />
            {role}
          </Badge>
        )
      case "意向团员":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 gap-1">
            <UserPlus className="h-3 w-3" />
            {role}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已发布":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{status}</Badge>
      case "审核中":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{status}</Badge>
      case "草稿":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("地图")) return <Image className="h-4 w-4 text-emerald-400" />
    if (type.includes("材质")) return <Image className="h-4 w-4 text-blue-400" />
    if (type.includes("光影")) return <Image className="h-4 w-4 text-amber-400" />
    if (type.includes("模组") || type.includes("插件")) return <Code className="h-4 w-4 text-purple-400" />
    return <FileText className="h-4 w-4 text-gray-400" />
  }

  // Scenario 1: No team
  if (!hasTeam || myCreatedTeams.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hr-hub">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回平台人力
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">您尚未成立任何团队</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              您需要先成立一个团队，才能使用团队管理功能。
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/team/create">成立团队</Link>
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/hr-hub">返回平台人力</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Scenario 2: Show team selection list
  if (selectedTeamId === null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hr-hub">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回平台人力
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">管理我的团队</h1>
            <p className="text-muted-foreground">选择要管理的团队</p>
          </div>

          <div className="space-y-4">
            {myCreatedTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className="w-full bg-card border border-border rounded-lg p-5 hover:border-emerald-500/50 hover:bg-muted/30 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      team.name[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate">{team.name}</h3>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1 flex-shrink-0">
                        <Crown className="h-3 w-3" />
                        创建者
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">{team.slogan}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {team.memberCount} 名成员
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {team.projectCount} 个作品
                      </span>
                      <span>创建于 {team.createdDate}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/team/create" className="gap-2">
                <Plus className="h-4 w-4" />
                成立新团队
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Scenario 3: Manage selected team
  const selectedTeam = myCreatedTeams.find((t) => t.id === selectedTeamId)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTeamId(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回团队列表
          </Button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400 border border-emerald-500/30">
            {selectedTeam?.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{selectedTeam?.name}</h1>
            <p className="text-muted-foreground text-sm">管理团队信息、成员和作品</p>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-8 h-11">
            <TabsTrigger value="info">团队信息</TabsTrigger>
            <TabsTrigger value="members">团队花名册</TabsTrigger>
            <TabsTrigger value="works">作品管理</TabsTrigger>
          </TabsList>

          {/* Tab 1: Team Info */}
          <TabsContent value="info">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">团队基本信息</h2>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-transparent"}
                >
                  {isEditing ? "保存修改" : "编辑信息"}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-lg bg-emerald-500/20 flex items-center justify-center text-3xl font-bold text-emerald-400 border border-emerald-500/30 overflow-hidden flex-shrink-0">
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="Team logo" className="w-full h-full object-cover" />
                        {isEditing && (
                          <button
                            onClick={() => setLogoPreview(null)}
                            className="absolute top-1 right-1 p-0.5 bg-destructive rounded-full text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {teamInfo.name[0]}
                        {isEditing && (
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="h-5 w-5 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onloadend = () => setLogoPreview(reader.result as string)
                                  reader.readAsDataURL(file)
                                }
                              }}
                            />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{teamInfo.name}</h3>
                    <p className="text-sm text-muted-foreground">{teamInfo.slogan}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">团队名称</label>
                    {isEditing ? (
                      <Input
                        value={teamInfo.name}
                        onChange={(e) => setTeamInfo({ ...teamInfo, name: e.target.value })}
                        maxLength={20}
                      />
                    ) : (
                      <p className="text-foreground">{teamInfo.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">团队URL</label>
                    <p className="text-foreground font-mono text-sm">{teamInfo.url}</p>
                    {isEditing && <p className="text-xs text-muted-foreground">URL 创建后不可修改</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">一句话标语</label>
                    {isEditing ? (
                      <Input
                        value={teamInfo.slogan}
                        onChange={(e) => setTeamInfo({ ...teamInfo, slogan: e.target.value })}
                        maxLength={50}
                      />
                    ) : (
                      <p className="text-foreground">{teamInfo.slogan}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">成立目标</label>
                    {isEditing ? (
                      <Textarea
                        value={teamInfo.goal}
                        onChange={(e) => setTeamInfo({ ...teamInfo, goal: e.target.value })}
                        maxLength={500}
                        rows={4}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-foreground leading-relaxed">{teamInfo.goal}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">团队文化氛围</label>
                    {isEditing ? (
                      <Textarea
                        value={teamInfo.culture}
                        onChange={(e) => setTeamInfo({ ...teamInfo, culture: e.target.value })}
                        maxLength={200}
                        rows={2}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-foreground">{teamInfo.culture}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">招募状态</label>
                    {isEditing ? (
                      <Textarea
                        value={teamInfo.recruiting}
                        onChange={(e) => setTeamInfo({ ...teamInfo, recruiting: e.target.value })}
                        maxLength={200}
                        rows={2}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-foreground">{teamInfo.recruiting}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">项目内容创作方向</label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {contentTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${type}`}
                              checked={teamInfo.creationDirection.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setTeamInfo({ ...teamInfo, creationDirection: [...teamInfo.creationDirection, type] })
                                } else {
                                  setTeamInfo({
                                    ...teamInfo,
                                    creationDirection: teamInfo.creationDirection.filter((t) => t !== type),
                                  })
                                }
                              }}
                            />
                            <label htmlFor={`edit-${type}`} className="text-sm cursor-pointer">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {teamInfo.creationDirection.map((d) => (
                          <Badge key={d} variant="secondary">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">团队创作计划</label>
                    {isEditing ? (
                      <Textarea
                        value={teamInfo.creationPlan}
                        onChange={(e) => setTeamInfo({ ...teamInfo, creationPlan: e.target.value })}
                        maxLength={1000}
                        rows={4}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-foreground leading-relaxed">{teamInfo.creationPlan}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">团队简介</label>
                    {isEditing ? (
                      <Textarea
                        value={teamInfo.intro}
                        onChange={(e) => setTeamInfo({ ...teamInfo, intro: e.target.value })}
                        maxLength={1000}
                        rows={3}
                        className="resize-none"
                      />
                    ) : (
                      <p className="text-foreground leading-relaxed">{teamInfo.intro}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Team Roster */}
          <TabsContent value="members">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">团队花名册</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    当前成员 {members.length} 人
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-transparent gap-1"
                    onClick={() => setIsEditingTitles(!isEditingTitles)}
                  >
                    <Settings className="h-4 w-4" />
                    称呼设置
                  </Button>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
                    <Plus className="h-4 w-4" />
                    邀请成员
                  </Button>
                </div>
              </div>

              {/* Role Title Settings */}
              {isEditingTitles && (
                <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-400" />
                    设置各职务的团队内称呼
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    您可以自定义各职务在团队内显示的称呼，例如将"管理者"改为"副队长"
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Crown className="h-3 w-3 text-amber-400" />
                        团队成立者
                      </label>
                      <Input
                        value={roleTitles.团队成立者}
                        onChange={(e) => setRoleTitles({ ...roleTitles, 团队成立者: e.target.value })}
                        placeholder="如：队长"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-400" />
                        管理者
                      </label>
                      <Input
                        value={roleTitles.管理者}
                        onChange={(e) => setRoleTitles({ ...roleTitles, 管理者: e.target.value })}
                        placeholder="如：副队长"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <UserCheck className="h-3 w-3 text-emerald-400" />
                        正式团员
                      </label>
                      <Input
                        value={roleTitles.正式团员}
                        onChange={(e) => setRoleTitles({ ...roleTitles, 正式团员: e.target.value })}
                        placeholder="如：正式队员"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <UserPlus className="h-3 w-3 text-gray-400" />
                        意向团员
                      </label>
                      <Input
                        value={roleTitles.意向团员}
                        onChange={(e) => setRoleTitles({ ...roleTitles, 意向团员: e.target.value })}
                        placeholder="如：试用队员"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => setIsEditingTitles(false)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      保存称呼设置
                    </Button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索成员..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Members Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">成员</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">团队职务</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">团内称呼</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">加入时间</th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">状态</th>
                      <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members
                      .filter((m) => m.name.includes(searchMember))
                      .map((member, index) => (
                        <tr
                          key={member.id}
                          className={`border-t border-border hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "" : "bg-muted/10"}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {member.avatar}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{getRoleBadge(member.role)}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                              {member.title || roleTitles[member.role as keyof typeof roleTitles] || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{member.joinDate}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${member.status === "在线" ? "bg-emerald-500" : "bg-gray-500"}`}
                              />
                              <span className="text-sm">{member.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {member.role !== "团队成立者" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMemberId(member.id)
                                      setEditingMemberTitle(member.title)
                                      setShowTitleDialog(true)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    设置个人称呼
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedMemberId(member.id)
                                      setShowRoleDialog(true)
                                    }}
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    调整身份
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => {
                                      setSelectedMemberId(member.id)
                                      setShowKickDialog(true)
                                    }}
                                  >
                                    <UserX className="h-4 w-4 mr-2" />
                                    踢出团队
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Role Legend */}
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">职务说明与晋升规则</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium">团队成立者</span>
                      <span className="text-xs text-muted-foreground">- 最高权限，可管理所有成员</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium">管理者</span>
                      <span className="text-xs text-muted-foreground">- 协助管理团队</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">正式团员</span>
                      <span className="text-xs text-muted-foreground">- 正式成员</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">意向团员</span>
                      <span className="text-xs text-muted-foreground">- 待转正成员</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <h4 className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-amber-400" />
                      晋升时间要求
                    </h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <ArrowUp className="h-3 w-3" />
                      意向团员 → 正式团员：加入满 6 个月
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <ArrowUp className="h-3 w-3" />
                      正式团员 → 管理者：成为正式团员满 12 个月
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Change Dialog */}
            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>调整成员身份</DialogTitle>
                  <DialogDescription>
                    {selectedMemberId && (() => {
                      const member = members.find(m => m.id === selectedMemberId)
                      if (!member) return null
                      return (
                        <span>
                          当前成员：<span className="font-medium text-foreground">{member.name}</span>，
                          职务：<span className="font-medium text-foreground">{member.role}</span>
                        </span>
                      )
                    })()}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedMemberId && (() => {
                  const member = members.find(m => m.id === selectedMemberId)
                  if (!member) return null
                  const promotionInfo = getPromotionInfo(member)
                  const canPromoteNow = canPromote(member)
                  
                  return (
                    <div className="space-y-4 py-4">
                      {/* Promotion Info */}
                      <div className={`p-3 rounded-lg border ${canPromoteNow ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <div className="flex items-center gap-2">
                          {canPromoteNow ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-400" />
                          )}
                          <span className={`text-sm ${canPromoteNow ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {promotionInfo}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        {member.role === "意向团员" && (
                          <Button
                            className="w-full justify-start gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            disabled={!canPromoteNow}
                            onClick={() => handlePromote(member.id)}
                          >
                            <ArrowUp className="h-4 w-4" />
                            转正为正式团员
                          </Button>
                        )}
                        {member.role === "正式团员" && (
                          <Button
                            className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={!canPromoteNow}
                            onClick={() => handlePromote(member.id)}
                          >
                            <ArrowUp className="h-4 w-4" />
                            晋升为管理者
                          </Button>
                        )}
                        {member.role === "管理者" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 bg-transparent"
                            onClick={() => handleDemote(member.id)}
                          >
                            <ArrowDown className="h-4 w-4" />
                            降级为正式团员
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })()}
                
                <DialogFooter>
                  <Button variant="outline" className="bg-transparent" onClick={() => setShowRoleDialog(false)}>
                    取消
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Kick Member Dialog */}
            <Dialog open={showKickDialog} onOpenChange={setShowKickDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">踢出成员</DialogTitle>
                  <DialogDescription>
                    {selectedMemberId && (() => {
                      const member = members.find(m => m.id === selectedMemberId)
                      if (!member) return null
                      return (
                        <span>
                          确定要将 <span className="font-medium text-foreground">{member.name}</span> 踢出团队吗？此操作不可撤销。
                        </span>
                      )
                    })()}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button variant="outline" className="bg-transparent" onClick={() => setShowKickDialog(false)}>
                    取消
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => selectedMemberId && handleKick(selectedMemberId)}
                  >
                    确认踢出
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Member Title Dialog */}
            <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>设置个人称呼</DialogTitle>
                  <DialogDescription>
                    {selectedMemberId && (() => {
                      const member = members.find(m => m.id === selectedMemberId)
                      if (!member) return null
                      return (
                        <span>
                          为 <span className="font-medium text-foreground">{member.name}</span> 设置在团队内的专属称呼
                        </span>
                      )
                    })()}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    value={editingMemberTitle}
                    onChange={(e) => setEditingMemberTitle(e.target.value)}
                    placeholder="输入称呼，如：技术骨干、美术组长..."
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    留空则使用职务的默认称呼
                  </p>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" className="bg-transparent" onClick={() => setShowTitleDialog(false)}>
                    取消
                  </Button>
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => selectedMemberId && handleUpdateMemberTitle(selectedMemberId, editingMemberTitle)}
                  >
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab 3: Works Management */}
          <TabsContent value="works">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">作品管理</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    已上传 {works.length} 个项目
                  </p>
                </div>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1">
                  <Plus className="h-4 w-4" />
                  上传作品
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {["all", "已发布", "审核中", "草稿"].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeWorkTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveWorkTab(tab)}
                    className={
                      activeWorkTab === tab
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-transparent"
                    }
                  >
                    {tab === "all" ? "全部" : tab}
                  </Button>
                ))}
              </div>

              {/* Works List */}
              <div className="space-y-3">
                {works
                  .filter((w) => activeWorkTab === "all" || w.status === activeWorkTab)
                  .map((work) => (
                    <div
                      key={work.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(work.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{work.name}</h3>
                          {getStatusBadge(work.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{work.type}</span>
                          <span>{work.date}</span>
                          {work.downloads > 0 && <span>{work.downloads} 次下载</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="查看">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="编辑">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive-foreground" title="删除">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {works.filter((w) => activeWorkTab === "all" || w.status === activeWorkTab).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>当前分类下暂无作品</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
