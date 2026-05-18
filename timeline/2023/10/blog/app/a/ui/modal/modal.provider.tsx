"use client";

import { BugReportDialog } from "@/app/a/ui/form/dialog/page";
import { AlertModal } from "@/app/a/ui/modal/_comp/AlertModal";
import { ConfirmModal, type ConfirmVariant } from "@/app/a/ui/modal/_comp/ConfirmModal";
import { InputModal } from "@/app/a/ui/modal/_comp/InputModal";
import { LoadingModal } from "@/app/a/ui/modal/_comp/LoadingModal";
import { Modal } from "@/app/a/ui/modal/_comp/Modal";
import { SignOutModal } from "@/app/a/ui/modal/_comp/SignOutModal";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type z from "zod";

// 模态框数据接口
export interface ModalData {
  // 通用属性
  title?: string;
  description?: string;
  content?: ReactNode;

  // 确认模态框
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;

  // input 模态框
  onSubmit?: (value: string) => void | Promise<void>;
  placeholder?: string;
  defaultValue?: string;
  inputSchema?: z.ZodString;

  // 加载模态框
  loadingText?: string;
  progress?: number;

  // 退出登录模态框
  userName?: string;

  // 自定义模态框
  component?: ReactNode;
  props?: Record<string, any>;

  // 创建项目模态框
  // CreateProjectModal 内部处理具体的创建逻辑，不需要外部 onSubmit

  // 样式配置
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  overlay?: boolean;
}

// Context 类型定义
interface ModalContextType {
  // 当前模态框状态
  open: boolean;
  setOpen: (open: boolean) => void;
  type: ModalType | null;
  data: ModalData | null;

  // 控制方法
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  updateModal: (data: Partial<ModalData>) => void;

  // 便捷方法
  showAlert: (title: string, description?: string) => void;
  showConfirm: (
    title: string,
    description?: string,
    onConfirm?: () => void | Promise<void>,
    variant?: ConfirmVariant,
  ) => void;
  showInput: (
    title: string,
    placeholder?: string,
    onSubmit?: (value: string) => void | Promise<void>,
    defaultValue?: string,
    inputSchema?: z.ZodString,
  ) => void;
  showLoading: (text?: string, progress?: number) => void;
  showSignOut: (userName?: string) => void;
  showCreateProject: () => void;
  showBugReport: () => void;
}

// 创建 Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider 组件
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ModalType | null>(null);
  const [data, setData] = useState<ModalData | null>(null);

  // 打开模态框
  const openModal = useCallback((modalType: ModalType, modalData?: ModalData) => {
    setType(modalType);
    setData(modalData || {});
    setOpen(true);
  }, []);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setOpen(false);
    // 延迟重置状态，等待动画完成
    setTimeout(() => {
      setType(null);
      setData(null);
    }, 200);
  }, []);

  // 更新模态框数据
  const updateModal = useCallback((newData: Partial<ModalData>) => {
    setData((prev) => (prev ? { ...prev, ...newData } : newData));
  }, []);

  // 显示警告模态框
  const showAlert = useCallback(
    (title: string, description?: string) => {
      openModal("alert", {
        title,
        description,
        confirmText: "确定",
        closable: true,
      });
    },
    [openModal],
  );

  // 显示确认模态框
  const showConfirm = useCallback(
    (
      title: string,
      description?: string,
      onConfirm?: () => void | Promise<void>,
      variant?: ConfirmVariant,
      confirmText?: string,
    ) => {
      openModal("confirm", {
        title,
        description,
        onConfirm,
        variant,
        confirmText: confirmText || variant === "destructive" ? "删除" : "确定",
        cancelText: "取消",
        closable: true,
      });
    },
    [openModal],
  );

  // 显示输入提示模态框
  const showInput = useCallback(
    (
      title: string,
      placeholder?: string,
      onSubmit?: (value: string) => void | Promise<void>,
      defaultValue?: string,
      inputSchema?: z.ZodString,
    ) => {
      openModal("input", {
        title,
        placeholder,
        onSubmit,
        defaultValue,
        inputSchema,
        confirmText: "确定",
        cancelText: "取消",
        closable: true,
      });
    },
    [openModal],
  );

  // 显示加载模态框
  const showLoading = useCallback(
    (text?: string, progress?: number) => {
      openModal("loading", {
        loadingText: text || "加载中...",
        progress,
        closable: false,
        overlay: true,
      });
    },
    [openModal],
  );

  // 显示退出登录模态框
  const showSignOut = useCallback(
    (userName?: string) => {
      openModal("signOut", {
        userName,
        closable: true,
      });
    },
    [openModal],
  );

  // 显示创建项目模态框
  const showCreateProject = useCallback(() => {
    openModal("createProject", {
      closable: true,
    });
  }, [openModal]);

  const showBugReport = useCallback(() => {
    openModal("bugReport", {
      closable: true,
    });
  }, [openModal]);

  const value: ModalContextType = {
    open,
    setOpen,
    type,
    data,
    openModal,
    closeModal,
    updateModal,
    showAlert,
    showConfirm,
    showInput,
    showLoading,
    showSignOut,
    showCreateProject,
    showBugReport,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <GlobalModalRenderer />
    </ModalContext.Provider>
  );
};
// 模态框类型定义
export type ModalType =
  | "signOut"
  | "confirm"
  | "alert"
  | "input"
  | "loading"
  | "custom"
  | "createProject"
  | "bugReport";

export function GlobalModalRenderer() {
  const { open, setOpen, type, data, closeModal } = useModal();

  if (!open || !type || !data) {
    return null;
  }

  // 根据类型渲染不同的模态框
  switch (type) {
    case "signOut":
      return <SignOutModal isOpen={open} onClose={closeModal} userName={data.userName} />;

    case "confirm":
      return (
        <ConfirmModal
          isOpen={open}
          onClose={closeModal}
          title={data.title || "确认操作"}
          description={data.description}
          onConfirm={data.onConfirm}
          confirmText={data.confirmText}
          cancelText={data.cancelText}
          variant={data.variant}
        />
      );

    case "alert":
      return (
        <AlertModal
          isOpen={open}
          onClose={closeModal}
          title={data.title || "提示"}
          description={data.description}
          confirmText={data.confirmText}
        />
      );

    case "input":
      return (
        <InputModal
          isOpen={open}
          onClose={closeModal}
          title={data.title || "输入信息"}
          placeholder={data.placeholder}
          onSubmit={data.onSubmit}
          defaultValue={data.defaultValue}
          inputSchema={data.inputSchema}
          confirmText={data.confirmText}
          cancelText={data.cancelText}
        />
      );

    case "loading":
      return (
        <LoadingModal isOpen={open} text={data.loadingText} progress={data.progress} />
      );
    case "bugReport":
      return <BugReportDialog isOpen={open} onOpenChange={setOpen} />;
    // case "createProject":
    //   return (
    //     <CreateProjectModal
    //       open={isOpen}
    //       onOpenChange={(open) => {
    //         if (!open) closeModal();
    //       }}
    //     />
    //   );

    case "custom":
      // return data.component || null;
      return (
        <Modal open={open} onOpenChange={setOpen} title={data.title}>
          {data.component || null}
        </Modal>
      );

    default:
      return null;
  }
}

// Hook for using modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

// 便捷 hooks
export function useAlert() {
  const { showAlert } = useModal();
  return showAlert;
}

export function useConfirm() {
  const { showConfirm } = useModal();
  return showConfirm;
}

export function useInput() {
  const { showInput } = useModal();
  return showInput;
}

export function useLoading() {
  const { showLoading, closeModal, updateModal } = useModal();

  return {
    showLoading,
    hideLoading: closeModal,
    updateProgress: (progress: number) => updateModal({ progress }),
  };
}

export function useSignOut() {
  const { showSignOut } = useModal();
  return showSignOut;
}

export function useCreateProject() {
  const { showCreateProject } = useModal();
  return showCreateProject;
}
