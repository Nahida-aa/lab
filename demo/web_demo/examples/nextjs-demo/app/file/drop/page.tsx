"use client";

import { useState, useMemo } from "react";
import { FileDropzone, acceptFileFromProjectType } from "./FileDropzone";
import {
  Select,
  SelectContent,
  SelectGroup, SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FileDropPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [projectType, setProjectType] = useState<string>("mod");
  const [selectedFileNames, setSelectedFileNames] = useState<Set<string>>(new Set());

  // 使用 Set 来跟踪文件名，避免重复
  const fileNamesSet = useMemo(() => {
    return new Set(files.map(file => file.name));
  }, [files]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    // 过滤掉重复的文件（基于文件名）
    const newFiles = selectedFiles.filter(file => !fileNamesSet.has(file.name));

    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const removeMultipleFiles = (fileNames: Set<string>) => {
    setFiles(files.filter(file => !fileNames.has(file.name)));
    setSelectedFileNames(new Set()); // 清空选择
  };

  const toggleFileSelection = (fileName: string) => {
    const newSelection = new Set(selectedFileNames);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedFileNames(newSelection);
  };

  const selectAllFiles = () => {
    setSelectedFileNames(new Set(files.map(file => file.name)));
  };

  const clearSelection = () => {
    setSelectedFileNames(new Set());
  };

  const clearAllFiles = () => {
    setFiles([]);
    setSelectedFileNames(new Set());
  };

  // 计算文件统计信息
  const fileStats = useMemo(() => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const fileTypes = new Set(files.map(file => file.type || 'unknown'));

    return {
      count: files.length,
      totalSize,
      uniqueTypes: fileTypes.size,
      types: Array.from(fileTypes)
    };
  }, [files]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold ">
            File Select Demo
          </h1>
          <p className="text-muted-foreground mt-2">
            Test the FileDropzone component with different project types
          </p>
        </div>

        {/* Project Type Selector */}
        <div className="bg-card p-4 rounded-lg ">
          <label htmlFor="projectType" className="block text-sm font-medium  mb-2">
            Project Type:
          </label>
          <Select defaultValue="mod" onValueChange={(value) => setProjectType(value)}>
            <SelectTrigger className="w-[180px] dark:bg-input bg-input">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mod">Mod (.jar, .zip, .litemod)</SelectItem>
              <SelectItem value="plugin">Plugin (.jar, .zip)</SelectItem>
              <SelectItem value="resourcepack">Resource Pack (.zip)</SelectItem>
              <SelectItem value="shader">Shader Pack (.zip)</SelectItem>
              <SelectItem value="datapack">Data Pack (.zip)</SelectItem>
              <SelectItem value="modpack">Mod Pack (.mrpack, .zip)</SelectItem>
              <SelectItem value="any">Any File Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File Dropzone */}
        <div className="bg-card p-6 rounded-lg ">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Select Files
          </h2>
          <FileDropzone
            accept={projectType === "any" ? undefined : acceptFileFromProjectType(projectType)}
            onFiles={handleFilesSelected}
            maxSize={50 * 1024 * 1024} // 50MB
            multiple={true}
            className="mb-4"
          />
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Selected Files ({fileStats.count})
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total size: {formatFileSize(fileStats.totalSize)} • {fileStats.uniqueTypes} file type(s)
                </p>
              </div>
              <div className="flex gap-2">
                {selectedFileNames.size > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => removeMultipleFiles(selectedFileNames)}
                      className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Remove Selected ({selectedFileNames.size})
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={selectedFileNames.size === files.length ? clearSelection : selectAllFiles}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {selectedFileNames.size === files.length ? "Deselect All" : "Select All"}
                </button>
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${selectedFileNames.has(file.name)
                    ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                    : "bg-gray-50 dark:bg-gray-700"
                    }`}
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={selectedFileNames.has(file.name)}
                      onChange={() => toggleFileSelection(file.name)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {file.type || "Unknown type"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="ml-4 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Action */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => {
                  // 这里可以添加实际的上传逻辑
                  alert(`Ready to upload ${files.length} file(s)`);
                }}
                disabled={files.length === 0}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Upload Files
              </button>
            </div>
          </div>
        )}

        {/* Usage Examples */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Usage Examples
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Basic Usage:</h3>
              <pre className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border overflow-x-auto">
                {`<FileDropzone
  onFiles={(files) => setFiles(files)}
  accept={acceptFileFromProjectType("mod")}
  maxSize={50 * 1024 * 1024}
  multiple={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Custom Accept Types:</h3>
              <pre className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border overflow-x-auto">
                {`<FileDropzone
  accept={{
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/pdf': ['.pdf']
  }}
  onFiles={handleFiles}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
