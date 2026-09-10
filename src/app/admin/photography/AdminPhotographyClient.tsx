"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  compressToLimit,
  formatBytes,
  isImageFile,
} from "@/lib/compress-image";
import type { Photo } from "@/types/photo";

type JobStatus = "queued" | "compressing" | "uploading" | "done" | "error";

type Job = {
  id: string;
  file: File;
  status: JobStatus;
  detail: string;
};

async function readError(res: Response) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || "上传失败";
  } catch {
    return "上传失败";
  }
}

function collectImages(list: FileList | null) {
  if (!list) return [];
  return Array.from(list).filter(isImageFile);
}

export function AdminPhotographyClient({
  initialPhotos,
}: {
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [album, setAlbum] = useState("");
  const [caption, setCaption] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const filesRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function load() {
    const res = await fetch(`/api/photography?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const data: unknown = await res.json();
    if (Array.isArray(data)) setPhotos(data);
  }

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = (await res.json()) as { authed?: boolean };
      if (!data.authed) router.replace("/admin");
    })();
  }, [router]);

  function addFiles(list: FileList | null) {
    const images = collectImages(list);
    if (!images.length) {
      setMessage("没有找到图片文件。");
      return;
    }
    setJobs(
      images.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        status: "queued",
        detail: formatBytes(file.size),
      })),
    );
    setMessage(`已选择 ${images.length} 张照片。大于 4MB 的会先自动压缩。`);
  }

  function patchJob(id: string, next: Partial<Job>) {
    setJobs((current) =>
      current.map((job) => (job.id === id ? { ...job, ...next } : job)),
    );
  }

  async function upload() {
    if (!jobs.length) {
      setMessage("请先选择照片或文件夹。");
      return;
    }
    setBusy(true);
    let ok = 0;
    let fail = 0;
    for (const job of jobs) {
      try {
        patchJob(job.id, { status: "compressing", detail: "压缩中…" });
        const prepared = await compressToLimit(job.file);
        const didCompress =
          prepared.size !== job.file.size || prepared !== job.file;
        patchJob(job.id, {
          status: "uploading",
          detail: didCompress
            ? `${formatBytes(job.file.size)} → ${formatBytes(prepared.size)}`
            : formatBytes(prepared.size),
        });
        const form = new FormData();
        form.append("file", prepared);
        form.append("album", album);
        form.append("caption", caption);
        const res = await fetch("/api/photography", { method: "POST", body: form });
        if (!res.ok) throw new Error(await readError(res));
        patchJob(job.id, { status: "done", detail: "已上传" });
        ok += 1;
      } catch (error) {
        fail += 1;
        patchJob(job.id, {
          status: "error",
          detail: error instanceof Error ? error.message : "失败",
        });
      }
    }
    setBusy(false);
    setMessage(`完成：成功 ${ok} 张${fail ? `，失败 ${fail} 张` : ""}。`);
    if (filesRef.current) filesRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
    await load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/photography?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) await load();
    else setMessage("删除失败，请先登录");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-serif text-xl">前台正在展示 {photos.length} 张</h2>
        <p className="text-sm text-[var(--muted)]">
          下面这些就是访客在「摄影自留地」看到的图。点删除后，前台会马上拿掉。
        </p>
        {photos.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">还没有已发布的照片。</p>
        ) : (
          <div className="grid gap-3">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.album}
                    className="h-20 w-20 shrink-0 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-serif">{photo.album}</p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      {photo.caption || "无旁白"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => remove(photo.id)}>
                  删除
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Card className="space-y-3">
        <h1 className="font-serif text-2xl">上传照片</h1>
        <p className="text-sm text-[var(--muted)]">
          可多选，也可直接选整个文件夹。单张超过 4MB 会在浏览器里自动压到
          4MB 以内再上传。影集名称会成为前台分组标题。
        </p>
        <input
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="影集名称，例如 2026"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="光影旁白（多张时会用同一句，可留空）"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <input
          ref={filesRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
        <input
          ref={folderRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
          {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => filesRef.current?.click()}>
            选择照片（可多选）
          </Button>
          <Button variant="ghost" onClick={() => folderRef.current?.click()}>
            选择文件夹
          </Button>
        </div>
        {jobs.length ? (
          <ul className="max-h-56 space-y-2 overflow-auto text-sm">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-1.5"
              >
                <span className="truncate">{job.file.name}</span>
                <span className="shrink-0 text-[var(--muted)]">{job.detail}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <Button onClick={upload} disabled={busy}>
          {busy ? "处理中…" : "开始上传"}
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </Card>
    </div>
  );
}
