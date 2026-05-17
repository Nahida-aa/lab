"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Coins,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function InvestorCertifyPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    router.push("/investor-certification/pending");
  };

  // 内容类型偏好
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
  ];

  // 投资偏好风格
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
  ];
  const formatter = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Coins className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">投资者认证</h1>
                <p className="text-sm text-muted-foreground">
                  成为平台内容生态的支持者和推动者
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Role Description */}
        <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-semibold text-amber-500">投资者身份说明</p>
              <p className="text-muted-foreground">
                投资者是平台内容生态的重要支持者，通过资金和资源支持推动优质内容的产出。
                投资者认证不强调学历背景，而是重点考察您在平台内的消费记录、投资意愿和对内容生态的期望。
                成为认证投资者后，您可以参与项目众筹、定制内容委托、获得优先体验权等特权。
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Consumption Record - Required */}
          <Card className="border-2 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                平台消费记录
                <Badge variant="destructive" className="bg-red-500">
                  必填
                </Badge>
              </CardTitle>
              <CardDescription>
                您在本平台的消费情况是投资能力的重要参考
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  系统将自动读取您在平台内的消费总额。投资者认证要求平台消费总额达到一定门槛。
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">
                    平台消费总额
                  </div>
                  <div className="text-2xl font-bold text-amber-500">
                    ¥ {(258000 / 100).toFixed(2)}{" "}
                    {formatter.format(258000 / 100)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    已满足认证门槛（¥500）
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">
                    购买内容数量
                  </div>
                  <div className="text-2xl font-bold text-emerald-500">
                    36 个
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    包括模组、材质包、地图等
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-investment">
                  其他投资/赞助经历（选填）
                </Label>
                <Textarea
                  id="additional-investment"
                  placeholder="如您在其他平台有过投资、赞助创作者的经历，可以在此说明（如 Patreon 赞助、众筹平台投资等）"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Investment Intention - Required */}
          <Card className="border-2 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                投资意向
                <Badge variant="destructive" className="bg-red-500">
                  必填
                </Badge>
              </CardTitle>
              <CardDescription>告诉我们您喜欢和关注的内容类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  此部分信息将帮助平台为您推荐符合兴趣的项目，也让创作者了解投资者的需求方向。
                </p>
              </div>

              <div className="space-y-3">
                <Label>
                  喜欢的内容类型 <span className="text-red-500">*</span>
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {contentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`content-${type}`} />
                      <Label
                        htmlFor={`content-${type}`}
                        className="font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>偏好的风格</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {stylePreferences.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox id={`style-${style}`} />
                      <Label
                        htmlFor={`style-${style}`}
                        className="font-normal cursor-pointer"
                      >
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favorite-experience">
                  您最喜欢的游戏体验是什么？{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="favorite-experience"
                  placeholder="描述您在 Minecraft 中最享受的游戏体验（如：探索大型冒险地图、使用复杂的科技模组、欣赏精美的建筑作品等）"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Investment Expectation - Required */}
          <Card className="border-2 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                投资期望
                <Badge variant="destructive" className="bg-red-500">
                  必填
                </Badge>
              </CardTitle>
              <CardDescription>
                您希望平台内的创作者和团队产出什么样的内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-400">
                  您的期望将直接影响平台的内容发展方向，帮助创作者了解市场需求，产出更多高质量的内容。
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-expectation">
                  您希望看到什么样的新内容？{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content-expectation"
                  placeholder="描述您希望平台内的创作者和施工团队能够制作出什么样的内容（如：更多高质量的科幻题材地图、更完善的工业模组、更精美的材质包等）"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality-priority">
                  您最看重内容的哪些方面？{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="quality-priority"
                  placeholder="描述您评判内容质量的标准（如：创意新颖性、技术完成度、美术水平、可玩性、稳定性、更新频率等）"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-budget">预期投资预算（选填）</Label>
                <Select>
                  <SelectTrigger id="investment-budget" className="w-full">
                    <SelectValue placeholder="请选择您的预期投资预算范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100-500">¥100 - ¥500 / 月</SelectItem>
                    <SelectItem value="500-1000">¥500 - ¥1000 / 月</SelectItem>
                    <SelectItem value="1000-3000">
                      ¥1000 - ¥3000 / 月
                    </SelectItem>
                    <SelectItem value="3000-10000">
                      ¥3000 - ¥10000 / 月
                    </SelectItem>
                    <SelectItem value="10000+">¥10000 以上 / 月</SelectItem>
                    <SelectItem value="flexible">灵活安排</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-style">偏好的支持方式</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-crowdfunding" />
                    <Label
                      htmlFor="style-crowdfunding"
                      className="font-normal cursor-pointer"
                    >
                      项目众筹
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-commission" />
                    <Label
                      htmlFor="style-commission"
                      className="font-normal cursor-pointer"
                    >
                      定制委托
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-subscription" />
                    <Label
                      htmlFor="style-subscription"
                      className="font-normal cursor-pointer"
                    >
                      定制委托
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-donation" />
                    <Label
                      htmlFor="style-donation"
                      className="font-normal cursor-pointer"
                    >
                      打赏捐赠
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-preorder" />
                    <Label
                      htmlFor="style-preorder"
                      className="font-normal cursor-pointer"
                    >
                      预购/早鸟
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="style-sponsorship" />
                    <Label
                      htmlFor="style-sponsorship"
                      className="font-normal cursor-pointer"
                    >
                      长期赞助
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Message - Optional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                给创作者的话
                <Badge variant="secondary">选填</Badge>
              </CardTitle>
              <CardDescription>您想对平台内的创作者说些什么</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  此部分信息将公开展示在您的投资者档案中，创作者可以看到您的寄语和期望。
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-to-creators">寄语</Label>
                <Textarea
                  id="message-to-creators"
                  placeholder="写下您想对创作者们说的话，您的鼓励和期望会成为他们创作的动力..."
                  rows={4}
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
              className="bg-amber-500 hover:bg-amber-600 min-w-[120px]"
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
            投资者认证主要考察您的平台消费记录和投资意愿，不强调学历背景。
          </p>
        </div>
      </main>
    </div>
  );
}
