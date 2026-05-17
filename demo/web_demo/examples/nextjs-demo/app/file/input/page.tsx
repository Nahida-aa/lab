"use client";
import { useEffect, useState } from "react";

export default function GlobalFileDrop() {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // 这里简单处理：当离开 window 时关闭拖拽状态
      if ((e.target as HTMLElement).nodeName === "HTML") {
        setIsDragging(false);
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer?.files || []);
      console.log("Dropped files:", files);
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
  }, []);

  return (
    <>
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-none">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            释放鼠标以上传文件
          </div>
        </div>
      )}
    </>
  );
}
