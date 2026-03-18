"use client";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function GlobalFileDrop() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSelectFile = useCallback(async (file: File) => {
    console.log("开始处理文件:", file);
    setSelectedFile(file);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/file/next`);
  }, [router]); // ✅ 明确依赖 router

  // react-dropzone 用于按钮选择文件
  const { getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onSelectFile(acceptedFiles[0]); // ✅ 点击按钮时处理
      }
    },
  });

  useEffect(() => {
    let dragCounter = 0;//用 计数法（推荐）, 有更好的客户端兼容性
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      setIsDragging(true);
    };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
      console.log('dragleave:', (e.target as HTMLElement).nodeName, dragCounter);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0) {
        onSelectFile(files[0]); // ✅ 拖拽时处理
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [onSelectFile]);

  const onClick = () => {
    console.log("onClick");
    open();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* 上传按钮 */}
      <Button
        onPress={onClick}
      // className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 relative z-10"
      >
        选择文件
      </Button>

      {/* dropzone input 必须在 DOM 中 */}
      <input {...getInputProps()} className="hidden" />

      {/* 拖拽提示层 */}
      {isDragging && (<div className="pointer-events-none  drop-area" />)}
    </main>
  );
}
