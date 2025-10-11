"use client"
import Image from "next/image"
import { useState } from "react"

const SIZES = [16, 32, 48, 64, 128, 256];

async function canvasPngArrayBufferFromImage(img: HTMLImageElement | ImageBitmap, size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // 清除并绘制居中缩放（保持纵横比并填充）
  ctx.clearRect(0, 0, size, size);
  const iw = ('width' in img) ? img.width : (img as ImageBitmap).width;
  const ih = ('height' in img) ? img.height : (img as ImageBitmap).height;
  const ratio = Math.min(size / iw, size / ih);
  const w = Math.round(iw * ratio);
  const h = Math.round(ih * ratio);
  const dx = Math.round((size - w) / 2);
  const dy = Math.round((size - h) / 2);
  ctx.drawImage(img as CanvasImageSource, dx, dy, w, h);
  // 导出 PNG Blob，再转 ArrayBuffer
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) throw new Error('canvas toBlob failed');
  return await blob.arrayBuffer();
}

async function imageFileToIcoBlob(file: File) {
  // 先把 file 转成 ImageBitmap（更快且避免 img onload）
  const imgBitmap = await createImageBitmap(file);
  // 为每个尺寸生成 PNG ArrayBuffer（只保留尺寸下 >= 1px）
  const pngBuffers = await Promise.all(SIZES.map((s) => canvasPngArrayBufferFromImage(imgBitmap, s)));

  // 浏览器端打包 ICO（把 PNG 数据直接嵌入 ICO 容器）
  function packPngsToIco(pngs: ArrayBuffer[], sizes: number[]) {
    const count = pngs.length;
    const header = new ArrayBuffer(6);
    const headerView = new DataView(header);
    headerView.setUint16(0, 0, true); // reserved
    headerView.setUint16(2, 1, true); // image type 1 = icon
    headerView.setUint16(4, count, true); // number of images

    const entrySize = 16;
    const entries = new ArrayBuffer(entrySize * count);
    const entriesView = new DataView(entries);

    // offsets start after header + all entries
    let offset = 6 + entrySize * count;

    for (let i = 0; i < count; i++) {
      const size = sizes[i] ?? 0;
      const png = pngs[i];
      const pngLen = png.byteLength;

      const entryBase = i * entrySize;
      // width (1 byte): 0 means 256
      entriesView.setUint8(entryBase + 0, size >= 256 ? 0 : size);
      // height (1 byte)
      entriesView.setUint8(entryBase + 1, size >= 256 ? 0 : size);
      // color count (1 byte): 0 if >=8bpp
      entriesView.setUint8(entryBase + 2, 0);
      // reserved (1 byte)
      entriesView.setUint8(entryBase + 3, 0);
      // planes (2 bytes) - for PNG in ICO, set 0 or 1; 0 is acceptable
      entriesView.setUint16(entryBase + 4, 0, true);
      // bitCount (2 bytes) - when embedding PNG, 32 is common
      entriesView.setUint16(entryBase + 6, 32, true);
      // bytes in resource (4 bytes)
      entriesView.setUint32(entryBase + 8, pngLen, true);
      // image offset (4 bytes)
      entriesView.setUint32(entryBase + 12, offset, true);

      offset += pngLen;
    }

    // concat header + entries + png data
    const totalSize = 6 + entrySize * count + pngs.reduce((s, p) => s + p.byteLength, 0);
    const out = new Uint8Array(totalSize);
    let pos = 0;
    out.set(new Uint8Array(header), pos); pos += header.byteLength;
    out.set(new Uint8Array(entries), pos); pos += entries.byteLength;
    for (let i = 0; i < pngs.length; i++) {
      out.set(new Uint8Array(pngs[i]), pos);
      pos += pngs[i].byteLength;
    }

    return out.buffer;
  }

  const icoArrayBuffer = packPngsToIco(pngBuffers, SIZES);
  return new Blob([icoArrayBuffer], { type: 'image/x-icon' });
}

export function Img2Ico() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setDownloading(true);
    try {
      const icoBlob = await imageFileToIcoBlob(file);
      const url = URL.createObjectURL(icoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (file.name.replace(/\.[^.]+$/, '') || 'icon') + '.ico';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      let msg: string;
      if (err instanceof Error) msg = err.message;
      else msg = String(err);
      setError(msg);
    } finally {
      setDownloading(false);
    }
  }

  return <>
    <input type="file" accept="image/*" onChange={onFile} />
    {downloading && <div>生成中…</div>}
    {error && <div style={{ color: 'red' }}>{error}</div>}
    <p>上传图片(PNG/JPG/SVG/GIF 等)。外部 URL 请先另存为文件或确保 CORS 可用。</p>
  </>
}