"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Upload,
  FileText,
  X,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConstructorCertificationPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [educationPublic, setEducationPublic] = useState(false);
  const [abilityPublic, setAbilityPublic] = useState(false);
  const [educationFiles, setEducationFiles] = useState<File[]>([]);
  const [abilityFiles, setAbilityFiles] = useState<File[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    router.push("/constructor-certification/pending");
  };

  const handleEducationFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setEducationFiles([...educationFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleAbilityFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAbilityFiles([...abilityFiles, ...Array.from(e.target.files)]);
    }
  };

  const handlePortfolioFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setPortfolioFiles([...portfolioFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeEducationFile = (index: number) => {
    setEducationFiles(educationFiles.filter((_, i) => i !== index));
  };

  const removeAbilityFile = (index: number) => {
    setAbilityFiles(abilityFiles.filter((_, i) => i !== index));
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles(portfolioFiles.filter((_, i) => i !== index));
  };

  // 施工技能类型 - 更偏向工程和应用能力
  const skillTypes = [
    "Java 模组开发",
    "Fabric/Forge 框架开发",
    "数据包开发",
    "命令方块工程",
    "红石工程",
    "建筑施工",
    "3D 建模",
    "材质绘制",
    "光影编程",
    "服务器插件开发",
    "地图制作",
    "音效设计",
    "UI/UX 设计",
    "性能优化",
    "多语言本地化",
    "测试与调试",
  ];

  // 工程类专业方向
  const engineeringMajors = [
    "计算机科学与技术",
    "软件工程",
    "数字媒体技术",
    "游戏设计与开发",
    "动画设计",
    "视觉传达设计",
    "建筑学",
    "土木工程",
    "电子信息工程",
    "人工智能",
    "其他工程类专业",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/hr-hub">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Wrench className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">施工者认证</h1>
                <p className="text-sm text-muted-foreground">
                  认证您的专业技术能力，成为项目的实现者
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Role Description */}
        <div className="mb-8 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <Wrench className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-semibold text-orange-500">施工者身份说明</p>
              <p className="text-muted-foreground">
                施工者是将创作者的想法和项目计划最终实现的专业执行者，类似于电影制作中的技术团队、特效师、程序员等角色。
                认证施工者需要具备实际的工程技术能力，如编程、建模、材质绘制等应用型技能，学历背景更偏向工程类和应用类专业。
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Technical Education - Required */}
          <Card className="border-2 border-orange-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    技术学历认证
                    <Badge variant="destructive" className="bg-red-500">
                      必填
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    请提供您的工程/技术类学历背景
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEducationPublic(!educationPublic)}
                  className="gap-2"
                >
                  {educationPublic ? (
                    <>
                      <Eye className="h-4 w-4" />
                      公开
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      隐藏
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-start gap-2 p-3 mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  您可以决定是否让平台内的其他用户能够看到您的学历认证信息。施工者认证优先考虑工程类、技术类专业背景。
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">
                    毕业院校 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="university"
                    placeholder="请输入毕业院校"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">
                    专业方向 <span className="text-red-500">*</span>
                  </Label>
                  <Select required>
                    <SelectTrigger id="major" className="w-full">
                      <SelectValue placeholder="请选择专业方向" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineeringMajors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">
                    学位 <span className="text-red-500">*</span>
                  </Label>
                  <Select required>
                    <SelectTrigger id="degree" className="w-full">
                      <SelectValue placeholder="请选择学位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior-college">专科</SelectItem>
                      <SelectItem value="bachelor">学士</SelectItem>
                      <SelectItem value="master">硕士</SelectItem>
                      <SelectItem value="doctor">博士</SelectItem>
                      <SelectItem value="self-taught">自学成才</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation-year">
                    毕业年份 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="graduation-year"
                    type="number"
                    placeholder="2020"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education-files">
                  上传学历证明材料 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="education-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleEducationFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("education-files")?.click()
                    }
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    选择文件
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    支持 PDF、JPG、PNG 格式
                  </span>
                </div>
                {educationFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {educationFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEducationFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Ability - Required */}
          <Card className="border-2 border-orange-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    技术能力认证
                    <Badge variant="destructive" className="bg-red-500">
                      必填
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    展示您的实际技术能力和项目经验
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAbilityPublic(!abilityPublic)}
                  className="gap-2"
                >
                  {abilityPublic ? (
                    <>
                      <Eye className="h-4 w-4" />
                      公开
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      隐藏
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-start gap-2 p-3 mt-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  您可以决定是否让平台内的其他用户能够看到您的技术能力信息。这是施工者认证的核心评估内容。
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>
                  掌握的施工技能 <span className="text-red-500">*</span>
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {skillTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`skill-${type}`} />
                      <Label
                        htmlFor={`skill-${type}`}
                        className="font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience-years">
                  相关工作/项目经验年限 <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="experience-years" className="w-full">
                    <SelectValue placeholder="请选择经验年限" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">1 年以下</SelectItem>
                    <SelectItem value="1-3">1-3 年</SelectItem>
                    <SelectItem value="3-5">3-5 年</SelectItem>
                    <SelectItem value="5-10">5-10 年</SelectItem>
                    <SelectItem value="10+">10 年以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical-certificates">
                  技术资格证书 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="technical-certificates"
                  placeholder="请列举您持有的技术类证书（如：软件工程师认证、Unity开发者认证、Adobe认证等）"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-experience">
                  项目实战经验 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="project-experience"
                  placeholder="请详细描述您参与过的 Minecraft 或相关项目的实际开发经验（如：开发过哪些模组、制作过哪些地图、参与过哪些团队项目等）"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ability-files">
                  上传技术能力证明材料 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ability-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAbilityFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("ability-files")?.click()
                    }
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    选择文件
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    支持 PDF、JPG、PNG 格式
                  </span>
                </div>
                {abilityFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {abilityFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAbilityFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio - Required for Constructor */}
          <Card className="border-2 border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                作品集展示
                <Badge variant="destructive" className="bg-red-500">
                  必填
                </Badge>
              </CardTitle>
              <CardDescription>
                上传您的代表作品，展示实际施工能力
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-400">
                  作品集是施工者认证的重要评估依据。请上传至少 1-3
                  个代表您技术水平的作品，可以是模组、地图、材质包等的截图或演示文件。
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio-links">作品链接（选填）</Label>
                <Textarea
                  id="portfolio-links"
                  placeholder="如有在线作品，请提供链接（如 GitHub、CurseForge、Planet Minecraft 等）"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio-files">
                  上传作品文件/截图 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="portfolio-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.zip"
                    onChange={handlePortfolioFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("portfolio-files")?.click()
                    }
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    选择文件
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    支持 PDF、JPG、PNG、GIF、ZIP 格式
                  </span>
                </div>
                {portfolioFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {portfolioFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePortfolioFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Construction Intention - Optional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                施工意愿
                <Badge variant="secondary">选填</Badge>
              </CardTitle>
              <CardDescription>告诉我们您愿意承接的项目类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  此部分信息将公开给本平台内的所有用户，帮助创作者找到合适的施工合作伙伴。
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred-projects">偏好承接的项目类型</Label>
                <Textarea
                  id="preferred-projects"
                  placeholder="描述您更愿意参与的项目类型（如：大型 RPG 地图开发、模组功能实现、材质包制作等）"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-style">工作方式偏好</Label>
                <Textarea
                  id="work-style"
                  placeholder="描述您的工作方式偏好（如：全职/兼职、远程/线下、独立完成/团队协作等）"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/hr-hub">取消</Link>
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 min-w-[120px]"
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  已提交
                </>
              ) : (
                "提交认证"
              )}
            </Button>
          </div>
        </form>

        {/* Info Notice */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">提示：</strong>
            施工者认证重点评估您的实际技术能力和项目经验。技术学历认证、技术能力认证和作品集展示为必填项。
            认证通过后，您可以在平台上接受创作者的项目合作邀请。
          </p>
        </div>
      </main>
    </div>
  );
}
