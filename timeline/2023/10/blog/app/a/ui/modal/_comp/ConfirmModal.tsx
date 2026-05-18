"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { AlertTriangle, CheckCircle, Info, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/app/a/ui/base/html";

export type ConfirmVariant = "info" | "destructive" | "warning";
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "确定",
  cancelText = "取消",
  variant,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // const getIcon = () => {
  //   switch (variant) {
  //     case "destructive":
  //       return <XCircle className="w-5 h-5 text-destructive" />;
  //     case "warning":
  //       return <AlertTriangle className="w-5 h-5 text-orange-500" />;
  //     case "info":
  //       return <Info className="w-5 h-5 text-blue-500" />;
  //     default:
  //       return null;
  //   }
  // };

  const getVariantStyle = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirm action failed:", error);
      // 这里可以显示错误提示
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* {getIcon()} */}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={getVariantStyle() as any}
            onClick={handleConfirm}
            pending={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
