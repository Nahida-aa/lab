"use client";

import { UploadIcon } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Accept, useDropzone } from "react-dropzone";

export type FileDropzoneProps = {
  onFiles?: (files: File[]) => void;
  multiple?: boolean;
  accept?: Accept;
  maxSize?: number; // bytes
  className?: string; // extra wrapper classes
};

// 文件类型常量，使用 Set 来管理扩展名
const FILE_EXTENSIONS = {
  JAR: new Set(['.jar']),
  ZIP: new Set(['.zip']),
  LITEMOD: new Set(['.litemod']),
  MRPACK: new Set(['.mrpack'])
} as const;

// MIME 类型常量
const MIME_TYPES = {
  JAVA_ARCHIVE: 'application/java-archive',
  X_JAVA_ARCHIVE: 'application/x-java-archive',
  ZIP: 'application/zip',
  MODRINTH_MODPACK: 'application/x-modrinth-modpack+zip'
} as const;

// 辅助函数：根据项目类型获取接受的文件格式
export const acceptFileFromProjectType = (projectType: string): Accept => {
  const createAcceptObject = (mimeExtensions: Array<[string, Set<string>]>): Accept => {
    return mimeExtensions.reduce((acc, [mimeType, extensions]) => {
      acc[mimeType] = Array.from(extensions);
      return acc;
    }, {} as Accept);
  };

  switch (projectType) {
    case 'mod':
      return createAcceptObject([
        [MIME_TYPES.JAVA_ARCHIVE, FILE_EXTENSIONS.JAR],
        [MIME_TYPES.X_JAVA_ARCHIVE, FILE_EXTENSIONS.JAR],
        [MIME_TYPES.ZIP, new Set([...FILE_EXTENSIONS.ZIP, ...FILE_EXTENSIONS.LITEMOD])]
      ]);

    case 'plugin':
      return createAcceptObject([
        [MIME_TYPES.JAVA_ARCHIVE, FILE_EXTENSIONS.JAR],
        [MIME_TYPES.X_JAVA_ARCHIVE, FILE_EXTENSIONS.JAR],
        [MIME_TYPES.ZIP, FILE_EXTENSIONS.ZIP]
      ]);

    case 'resourcepack':
    case 'shader':
    case 'datapack':
      return createAcceptObject([
        [MIME_TYPES.ZIP, FILE_EXTENSIONS.ZIP]
      ]);

    case 'modpack':
      return createAcceptObject([
        [MIME_TYPES.MODRINTH_MODPACK, FILE_EXTENSIONS.MRPACK],
        [MIME_TYPES.ZIP, FILE_EXTENSIONS.ZIP]
      ]);

    default:
      return {};
  }
};

export function FileDropzone({
  onFiles,
  multiple = true,
  accept,
  maxSize,
  className = "",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onFiles) onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    multiple,
    accept: accept,
    maxSize,
  });

  const rejectionMessage = useMemo(() => {
    if (!fileRejections || fileRejections.length === 0) return null;
    // collect reasons
    return fileRejections.map((r) => {
      const fileName = r.file.name;
      const reasons = r.errors.map((e) => e.message).join(", ");
      return `${fileName}: ${reasons}`;
    }).join("; ");
  }, [fileRejections]);

  const acceptedTypesDisplay = useMemo(() => {
    if (!accept) return null;
    const extensions = Object.values(accept).flat();
    return extensions.length > 0 ? extensions.join(", ") : null;
  }, [accept]);

  return (
    <div className={"w-full " + className}>
      {/* biome-ignore lint/a11y/useSemanticElements: FileDropzone requires div for drag-and-drop functionality */}
      <div
        {...getRootProps()}
        role="button"
        tabIndex={0}
        aria-label="File select area. Drag and drop files here or click to select files"
        className={
          ` cursor-pointer relative flex  items-center gap-2 justify-center rounded-lg border-4 border-dashed p-6 transition-colors  focus:border-primary ` +
          (isDragActive
            ? "border-primary bg-primary/40 "
            : isDragReject
              ? "border-red-400 bg-red-50 dark:bg-red-950"
              : "border-foreground/50 ")
        }
        onKeyDown={(e) => {
          // enter/space should open file dialog
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const input = (e.currentTarget.querySelector("input[type=file]") as HTMLInputElement);
            input?.click();
          }
        }}
      >
        <input {...getInputProps()} />

        <UploadIcon size={16} className="" />
        <span className={`${isDragActive ? 'text-primary-foreground' : ''}`}>
          {isDragActive ? "Release to drop files" : "Drag & drop files here"}
        </span>
        or click to select files
        {/* <span className="text-sm text-gray-500 dark:text-gray-400"></span> */}
        {/* <p className="font-medium text-gray-900 dark:text-gray-100">
        </p> */}
        {/* <div className="text-center">

          {acceptedTypesDisplay && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Accepted: {acceptedTypesDisplay}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Max size: {(maxSize / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div> */}

      </div>
      {/* {rejectionMessage && (
        <div className="absolute bottom-2 left-4 right-4 text-xs text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">
          {rejectionMessage}
        </div>
      )} */}
    </div>
  );
}

/*
Usage example:

import FileDropzone from './FileDropzone';
import { useState } from 'react';

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="p-6">
      <FileDropzone
        multiple={false}
        accept={['image/*', '.pdf']}
        maxSize={5 * 1024 * 1024}
        onFiles={(f) => setFiles(f)}
      />

      <div className="mt-4">
        {files.map((f) => (
          <div key={f.name} className="text-sm">{f.name} — {(f.size / 1024).toFixed(1)} KB</div>
        ))}
      </div>
    </div>
  );
}
*/
