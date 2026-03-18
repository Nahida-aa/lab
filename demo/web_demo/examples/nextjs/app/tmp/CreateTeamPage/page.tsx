"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamUrl, setTeamUrl] = useState("");
  const [teamSlogan, setTeamSlogan] = useState("");
  const [teamGoal, setTeamGoal] = useState("");
  const [teamIntro, setTeamIntro] = useState("");
  const [teamCulture, setTeamCulture] = useState("");
  const [recruitingStatus, setRecruitingStatus] = useState("");
  const [creationDirection, setCreationDirection] = useState<string[]>([]);
  const [creationPlan, setCreationPlan] = useState("");

  const [hasMembership] = useState(false); // Set to true to test membership view

  const contentTypes = [
    "模组（功能模组）",
    "模组（优化模组）",
    "模组（辅助模组）",
    "整合包",
    "材质包",
    "地图（生存地图）",
    "地图（冒险地图）",
    "地图（解谜地图）",
    "地图（跑酷地图）",
    "地图（建筑地图）",
    "皮肤",
    "数据包",
    "服务器插件",
    "建筑作品",
    "光影包",
    "声音包",
    "命令方块作品",
    "创意内容",
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleContentType = (type: string) => {
    setCreationDirection((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSubmit = () => {
    console.log("Creating team:", {
      teamName,
      teamUrl,
      teamSlogan,
      teamGoal,
      teamCulture,
      recruitingStatus,
      creationDirection,
      creationPlan,
      teamIntro,
    });
    router.push("/");
  };

  const isFormValid =
    teamName.trim() &&
    teamUrl.trim() &&
    teamSlogan.trim() &&
    teamGoal.trim() &&
    teamCulture.trim() &&
    logoPreview;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回主页
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">创建团队</h1>
            <p className="text-muted-foreground">
              填写团队基本信息，创建您的创作团队
            </p>
          </div>

          <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-blue-500">会员权益说明</p>
                {hasMembership ? (
                  <div className="text-muted-foreground space-y-1">
                    <p>✓ 您已开通创作者会员，享有以下权益：</p>
                    <p className="ml-4">• 可以成立或加入最多 30 人的团队</p>
                    <p className="ml-4">• 可以以团队名义上传最多 15 个项目</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground space-y-1">
                    <p>
                      • 未开通会员：可成立或加入最多 5 人团队，上传最多 5 个项目
                    </p>
                    <p>
                      • 开通会员：可成立或加入最多 30 人团队，上传最多 15 个项目
                    </p>
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
                    <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border overflow-hidden">
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
                    <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">
                        上传
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
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
              <Label
                htmlFor="team-name"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队名称
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-name"
                placeholder="输入团队名称（3-20字符）"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={20}
                className="text-base"
              />
              <div className="text-xs text-muted-foreground text-right">
                {teamName.length}/20
              </div>
            </div>

            {/* 团队URL */}
            <div className="space-y-3">
              <Label
                htmlFor="team-url"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队URL
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-url"
                placeholder="https://platform.com/team/your-team"
                value={teamUrl}
                onChange={(e) => setTeamUrl(e.target.value)}
                className="text-base font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                团队专属访问地址，创建后不可修改
              </p>
            </div>

            {/* 团队一句话标语 */}
            <div className="space-y-3">
              <Label
                htmlFor="team-slogan"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队一句话标语
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Input
                id="team-slogan"
                placeholder="用一句话描述你的团队特色（20-50字符）"
                value={teamSlogan}
                onChange={(e) => setTeamSlogan(e.target.value)}
                maxLength={50}
                className="text-base"
              />
              <div className="text-xs text-muted-foreground text-right">
                {teamSlogan.length}/50
              </div>
            </div>

            {/* 团队成立目标 */}
            <div className="space-y-3">
              <Label
                htmlFor="team-goal"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队成立目标
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Textarea
                id="team-goal"
                placeholder="详细描述团队的成立目标和愿景（100-500字符）"
                value={teamGoal}
                onChange={(e) => setTeamGoal(e.target.value)}
                maxLength={500}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {teamGoal.length}/500
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="team-culture"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队文化氛围
                <Badge variant="destructive" className="text-xs">
                  必填
                </Badge>
              </Label>
              <Textarea
                id="team-culture"
                placeholder="描述团队的文化氛围，例如：轻松愉快、严谨专业、创新开放等"
                value={teamCulture}
                onChange={(e) => setTeamCulture(e.target.value)}
                maxLength={200}
                rows={3}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {teamCulture.length}/200
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                项目内容创作方向
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400 mb-3">
                  选择团队主要的创作内容类型，可多选
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {contentTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={creationDirection.includes(type)}
                      onCheckedChange={() => toggleContentType(type)}
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

            <div className="space-y-3">
              <Label
                htmlFor="creation-plan"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队创作计划
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400">
                  描述团队未来的创作规划和发展方向
                </p>
              </div>
              <Textarea
                id="creation-plan"
                placeholder="例如：未来一年计划制作3个大型冒险地图，开发2个功能模组，每月定期更新材质包..."
                value={creationPlan}
                onChange={(e) => setCreationPlan(e.target.value)}
                maxLength={1000}
                rows={6}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {creationPlan.length}/1000
              </div>
            </div>

            {/* 团队简介 - 选填 */}
            <div className="space-y-3">
              <Label
                htmlFor="team-intro"
                className="text-base font-semibold flex items-center gap-2"
              >
                团队简介
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <Textarea
                id="team-intro"
                placeholder="更详细的团队介绍，可以包含团队历史、成就等"
                value={teamIntro}
                onChange={(e) => setTeamIntro(e.target.value)}
                maxLength={1000}
                rows={4}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {teamIntro.length}/1000
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="recruiting-status"
                className="text-base font-semibold flex items-center gap-2"
              >
                招募状态
                <Badge variant="secondary" className="text-xs">
                  选填
                </Badge>
              </Label>
              <Textarea
                id="recruiting-status"
                placeholder="描述当前的招募情况，例如：暂不招募 / 长期招募建筑师和红石工程师 / 招募有经验的模组开发者..."
                value={recruitingStatus}
                onChange={(e) => setRecruitingStatus(e.target.value)}
                maxLength={200}
                rows={3}
                className="text-base resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {recruitingStatus.length}/200
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 mt-10 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 bg-transparent"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              创建团队
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
