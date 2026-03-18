"use client";

import { AlertCircle } from "lucide-react";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { UxAlert } from "@/components/uix/alert";

export default function AlertPage() {
  return (
    <main>
      <div className="grid grid-cols-[1fr_auto] w-full gap-2  p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2 ">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400  shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            您可以决定是否让平台内的其他创作者能够看到您的学历认证信息。
          </p>
        </div>
        <Field orientation="horizontal">
          <Switch className="mr-0.5" />
        </Field>
      </div>
      <UxAlert
        variant="warning"
        description="您可以决定是否让平台内的其他创作者能够看到您的学历认证信息。"
      >
        <Field orientation="horizontal">
          <Switch className="mr-0.5" />
        </Field>
      </UxAlert>
      <UxAlert
        variant="warning"
        title="您可以决定是否让平台内的其他创作者能够看到您的学历认证信息"
      >
        <Field orientation="horizontal">
          <Switch className="mr-0.5" />
        </Field>
      </UxAlert>
      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          此部分信息将公开给本平台内的所有用户，帮助其他创作者和用户了解您的创作方向。
        </p>
      </div>
      <UxAlert
        variant="info"
        description="此部分信息将公开给本平台内的所有用户，帮助其他创作者和用户了解您的创作方向"
      ></UxAlert>
      <UxAlert
        variant="info"
        title="此部分信息将公开给本平台内的所有用户，帮助其他创作者和用户了解您的创作方向"
      />
    </main>
  );
}
