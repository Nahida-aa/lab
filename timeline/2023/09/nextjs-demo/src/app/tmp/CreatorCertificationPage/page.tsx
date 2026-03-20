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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatorCertificationPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [educationPublic, setEducationPublic] = useState(false);
  const [abilityPublic, setAbilityPublic] = useState(false);
  const [educationFiles, setEducationFiles] = useState<File[]>([]);
  const [abilityFiles, setAbilityFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    router.push("/creator-certification/pending");
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

  const removeEducationFile = (index: number) => {
    setEducationFiles(educationFiles.filter((_, i) => i !== index));
  };

  const removeAbilityFile = (index: number) => {
    setAbilityFiles(abilityFiles.filter((_, i) => i !== index));
  };

  const contentTypes = [
    "模组（Mod）",
    "材质包",
    "地图",
    "皮肤",
    "数据包",
    "服务器插件",
    "建筑作品",
    "资源包组合",
    "命令方块作品",
    "创意内容",
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
            <div>
              <h1 className="text-2xl font-bold">创作者认证</h1>
              <p className="text-sm text-muted-foreground">
                完善您的创作者信息，提升平台影响力
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education Certification - Required */}
          <Card className="border-2 border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    学历认证
                    <Badge variant="destructive" className="bg-red-500">
                      必填
                    </Badge>
                  </CardTitle>
                  <CardDescription>请提供您的学历相关信息</CardDescription>
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
                  您可以决定是否让平台内的其他创作者能够看到您的学历认证信息。
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
                    专业 <span className="text-red-500">*</span>
                  </Label>
                  <Input id="major" placeholder="请输入专业" required />
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
                      <SelectItem value="bachelor">学士</SelectItem>
                      <SelectItem value="master">硕士</SelectItem>
                      <SelectItem value="doctor">博士</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
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
                {/* File list */}
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

          {/* Ability Certification - Required */}
          <Card className="border-2 border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    能力认证
                    <Badge variant="destructive" className="bg-red-500">
                      必填
                    </Badge>
                  </CardTitle>
                  <CardDescription>展示您的专业技能和资格证书</CardDescription>
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
                  您可以决定是否让平台内的其他创作者能够看到您的能力认证信息。
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificates">
                  职业资格证书 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="certificates"
                  placeholder="请列举您持有的职业资格证书、技能等级证书等（如：Java高级开发工程师认证、UI设计师认证等）"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="training">
                  培训经历 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="training"
                  placeholder="请列举您参加过的相关培训课程和获得的认证（如：Unity游戏开发课程、3D建模培训等）"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">
                  技能专长 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="skills"
                  placeholder="请描述您的核心技能和专长领域（如：精通Java编程、擅长像素艺术设计等）"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ability-files">
                  上传能力证明材料 <span className="text-red-500">*</span>
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
                {/* File list */}
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

          {/* Creation Intention - Optional */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    创作意愿
                    <Badge variant="secondary">选填</Badge>
                  </CardTitle>
                  <CardDescription>
                    告诉我们您想要创作的内容类型
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  此部分信息将公开给本平台内的所有用户，帮助其他创作者和用户了解您的创作方向。
                </p>
              </div>
              <div className="space-y-3">
                <Label>倾向制作的资源类型</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {contentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <Label
                        htmlFor={type}
                        className="font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="style-preference">喜好的风格和题材</Label>
                <Textarea
                  id="style-preference"
                  placeholder="描述您感兴趣的游戏风格和题材（如：中世纪建筑、科幻冒险、魔法系统等）"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Creation Plan - Optional */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    创作计划
                    <Badge variant="secondary">选填</Badge>
                  </CardTitle>
                  <CardDescription>分享您未来的创作规划</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  此部分信息将公开给本平台内的所有用户，让社区了解您的未来创作计划。
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="future-projects">未来计划制作的内容</Label>
                <Textarea
                  id="future-projects"
                  placeholder="描述您计划开发的项目（如：大型RPG冒险地图、全新的魔法模组、真实系材质包等）"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creation-frequency">创作频率</Label>
                <Select>
                  <SelectTrigger id="creation-frequency" className="w-full">
                    <SelectValue placeholder="请选择您的创作频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="occasionally">偶尔</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">创作目标</Label>
                <Textarea
                  id="goals"
                  placeholder="您希望通过创作达成什么目标？（如：提升技能、建立社区、商业变现等）"
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
              className="bg-emerald-500 hover:bg-emerald-600 min-w-[120px]"
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
            标记为"必填"的学历认证和能力认证部分必须完整填写并上传证明材料才能提交。您可以选择是否公开这些信息。创作意愿和创作计划为选填项，填写后将自动公开给所有平台用户。
          </p>
        </div>
      </main>
    </div>
  );
}
