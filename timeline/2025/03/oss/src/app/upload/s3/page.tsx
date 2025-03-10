"use client";

import { useEffect, useState } from "react";
// import { SubmitButton } from "~/components/common/SubmitButton";
import { UploadOutFile } from "~/lib/routes/upload/post";

export default function NxtPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [meFiles, setMeFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [inputCount, setInputCount] = useState(0);

  useEffect(() => {
    console.log("meFiles", meFiles);
  }, [meFiles]);


  const customUpload = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(new Array(files.length).fill(0)); // 初始化上传进度

    const getPresignedIn = {
      files: files.map((file) => ({
        name: file.name,
        type: file.type,  
        size: file.size,
        lastModified: file.lastModified,
      }))
    }
    const getPresignedRes = await fetch("/api/hono/upload/s3?actionType=upload&slug=test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getPresignedIn),
    });
    console.log("Get presigned response", getPresignedRes);
    const presignedOut = await getPresignedRes.json() as UploadOutFile[]
    console.log("Presigned URLs", presignedOut);
    console.log("Uploading", files.length, "files:", files);

    for (const [index, file] of files.entries()) {
      const presigned = presignedOut[index];
      if (!presigned) {
        console.error("No presigned URL found for", file.name);
        continue;
      }

      const uploadWithRealProgress = async (file: File, presigned: UploadOutFile) => {
        // 使用 ReadableStream 监控上传进度
        const reader = file.stream().getReader();
      
        let readBytes = 0;
        const totalBytes = file.size;
      
        const stream = new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value); // 立即将数据推送到流中
              readBytes += value.byteLength;
              const percent = (readBytes / totalBytes) * 100;
              console.log(`readBytes: ${readBytes}, totalBytes: ${totalBytes}, percent: ${percent.toFixed(2)}%`);
            }
            controller.close();
          }
        });
        
        // const response = new Response(stream);
        // const blob = await response.blob();
        
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presigned.url, true);
        return new Promise(async (resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percent = (e.loaded / e.total) * 100;
              console.log(`Upload progress: ${percent.toFixed(2)}%, ${e.loaded} / ${e.total} bytes`);
              setUploadProgress((prevProgress) => {
                const newProgress = [...prevProgress];
                newProgress[index] = percent;
                return newProgress;
              });
            }
          });
          xhr.onload = () => {
            resolve(xhr.response);
          }
          xhr.onerror = () => {
            reject(new Error("Upload failed"));
          }

          xhr.send(
            await(new Response(stream).blob())
          );
        })
      }

      try {
        const uploadRes = await uploadWithRealProgress(file, presigned);
        console.log("Upload response", uploadRes);
      } catch (e) {
        console.error("Failed to upload", file.name, "to", presigned.url, e);
      }
    }

    console.log("Upload Completed.");
    setIsUploading(false);
  };

  return (
    <main>
      <form action="" className="flex-col flex">
        me:
        <input
          type="file"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            setInputCount(inputCount + 1);
            console.log("inputCount:", inputCount);
            // 追加:
            setMeFiles((prevFiles) => [...prevFiles, ...files]);
          }}
        />
        {/* <SubmitButton isLoading={isUploading} onClick={async () => {
          await customUpload(meFiles);
        }
        }>s3Upload</SubmitButton> */}

        <ul>
          {meFiles.map((file, index) => (
            <li key={file.name}>
              <span className="space-x-2">
                <span>{file.name}</span><span>{file.type}</span><span>{file.webkitRelativePath}</span>
              </span>
              {uploadProgress[index] && isUploading && <>
                <progress value={uploadProgress[index]} max="100"></progress>
                {uploadProgress[index].toFixed(2)}%
              </>}
              <button className="bg-primary"
                onClick={() => {
                  setMeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
                  setUploadProgress((prevProgress) => prevProgress.filter((_, i) => i !== index));
                }}
              >删除</button>
            </li>
          ))}
        </ul>
      </form>
      <progress value={50} max="100"></progress>{50}%
    </main>
  );
}