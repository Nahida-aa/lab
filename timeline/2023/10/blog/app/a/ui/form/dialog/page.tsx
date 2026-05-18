"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // 假设 shadcn Dialog

// import { Button } from "@/components/ui/button"; // 用你的 Button
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // 可选：如果想嵌 Card
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/app/a/ui/base/html";
import { useState } from "react";
import z from "zod";

export default function Page() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <BugReportDialog isOpen={isOpen} onOpenChange={setOpen} />
    </>
  );
}

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});
export function BugReportDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void; // 外部控制 open
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // 关键：实时验证，修复 Dialog 中错误不显示
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      form.reset(); // 重置表单
      onOpenChange(false); // 提交成功后关闭 Dialog
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.reset(); // 取消时重置
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !form.formState.isSubmitting) {
      e.preventDefault();
      form.handleSubmit(onSubmit)(); // Enter 提交，带验证
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bug Report</DialogTitle>
          <DialogDescription>
            Help us improve by reporting bugs you encounter.
          </DialogDescription>
        </DialogHeader>
        <BugReportForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
export function BugReportForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void; // 外部控制 open
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // 关键：实时验证，修复 Dialog 中错误不显示
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      form.reset(); // 重置表单
      onOpenChange(false); // 提交成功后关闭 Dialog
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    form.reset(); // 取消时重置
    onOpenChange(false);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Bug Title</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="Login button not working on mobile"
              // onKeyDown={handleKeyDown} // 加键盘支持
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            {/* 如果 FieldError 在 Dialog 中仍不显示，替换为：<FormMessage>{fieldState.error?.message}</FormMessage> (需 shadcn Form) */}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-demo-description">Description</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="form-rhf-demo-description"
                placeholder="I'm having an issue with the login button on mobile."
                rows={6}
                className="min-h-24 resize-none"
                aria-invalid={fieldState.invalid}
                // onKeyDown={handleKeyDown} // 加键盘支持
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="tabular-nums">
                  {field.value.length}/100 characters
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              Include steps to reproduce, expected behavior, and what actually happened.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Field orientation="horizontal">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          pending={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Field>
    </form>
  );
}
