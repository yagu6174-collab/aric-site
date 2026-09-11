"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

const FALLBACK_ALBUM = "未命名影集";

async function readError(res: Response) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || "操作失败";
  } catch {
    return "操作失败";
  }
}

function collectImages(list: FileList | null) {
  if (!list) return [];
  return Array.from(list).filter(isImageFile);
}

function albumOf(photo: Photo) {
  return photo.album.trim() || FALLBACK_ALBUM;
}

function folderNameFromFile(file?: File) {
  if (!file) return "";
  const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath || "";
  return rel.split(/[/\\]/).filter(Boolean)[0] || "";
}

function groupPhotos(photos: Photo[]) {
  const map = new Map<string, Photo[]>();
  for (const photo of photos) {
    const key = albumOf(photo);
    const list = map.get(key) ?? [];
    list.push(photo);
    map.set(key, list);
  }
  return [...map.entries()];
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
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const inferredAlbum = folderNameFromFile(jobs[0]?.file);
  const groups = useMemo(() => groupPhotos(photos), [photos]);
  const openPhotos = openAlbum
    ? photos.filter((photo) => albumOf(photo) === openAlbum)
    : [];

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

  useEffect(() => {
    if (openAlbum && !photos.some((photo) => albumOf(photo) === openAlbum)) {
      setOpenAlbum(null);
    }
  }, [photos, openAlbum]);

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
    const fromFolder = folderNameFromFile(images[0]);
    setMessage(
      fromFolder
        ? `已选择文件夹「${fromFolder}」里的 ${images.length} 张。未填写影集名时会用这个文件夹名。`
        : `已选择 ${images.length} 张照片。大于 4MB 的会先自动压缩。`,
    );
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
    const albumName = album.trim() || inferredAlbum || FALLBACK_ALBUM;
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
        form.append("album", albumName);
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
    setMessage(`完成：成功 ${ok} 张${fail ? `，失败 ${fail} 张` : ""}。已归入「${albumName}」。`);
    if (filesRef.current) filesRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
    await load();
    setOpenAlbum(albumName);
    router.refresh();
  }

  async function removeIds(ids: string[], label: string) {
    if (!ids.length) return;
    setMessage("");
    setBusy(true);
    const res = await fetch("/api/photography", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids.length === 1 ? { id: ids[0] } : { ids }),
      cache: "no-store",
    });
    setBusy(false);
    if (!res.ok) {
      setMessage(await readError(res));
      return;
    }
    const drop = new Set(ids);
    setPhotos((current) => current.filter((photo) => !drop.has(photo.id)));
    setMessage(label);
    await load();
    router.refresh();
  }

  async function remove(id: string) {
    await removeIds([id], "已删除 1 张。");
  }

  async function removeAlbum(name: string) {
    const ids = photos.filter((photo) => albumOf(photo) === name).map((photo) => photo.id);
    if (!ids.length) return;
    const ok = window.confirm(`确定删除「${name}」全部 ${ids.length} 张？此操作不可恢复。`);
    if (!ok) return;
    await removeIds(ids, `已删除影集「${name}」共 ${ids.length} 张。`);
    setOpenAlbum(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-serif text-xl">
          前台正在展示 {photos.length} 张
          {groups.length ? ` · ${groups.length} 个影集` : ""}
        </h2>
        <p className="text-sm text-[var(--muted)]">
          按影集文件夹查看。点开文件夹可删单张，也可整组删除。前台会马上同步。
        </p>
        {photos.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">还没有已发布的照片。</p>
        ) : openAlbum ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-[var(--muted)]"
                onClick={() => setOpenAlbum(null)}
              >
                <ChevronLeft className="h-4 w-4" />
                全部影集
              </button>
              <Button variant="ghost" onClick={() => void removeAlbum(openAlbum)} disabled={busy}>
                {busy ? "删除中…" : "删除整组"}
              </Button>
            </div>
            <div>
              <h3 className="font-serif text-2xl">{openAlbum}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{openPhotos.length} 张</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {openPhotos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-xl bg-[var(--card)]">
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.album}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={() => void remove(photo.id)}
                    disabled={busy}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {groups.map(([name, items]) => (
              <div
                key={name}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]"
              >
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setOpenAlbum(name)}
                >
                  <FolderCover items={items} />
                  <div className="space-y-1 p-4">
                    <p className="truncate font-serif text-lg">{name}</p>
                    <p className="text-sm text-[var(--muted)]">{items.length} 张</p>
                  </div>
                </button>
                <div className="px-4 pb-4">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => void removeAlbum(name)}
                    disabled={busy}
                  >
                    {busy ? "删除中…" : "删除整组"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Card className="space-y-3">
        <h1 className="font-serif text-2xl">上传照片</h1>
        <p className="text-sm text-[var(--muted)]">
          可多选，也可直接选整个文件夹。单张超过 4MB 会在浏览器里自动压到
          4MB 以内再上传。影集名称会成为前台分组标题，也会出现在上面的文件夹里。
        </p>
        <input
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder={
            inferredAlbum
              ? `影集名称，不填则用文件夹「${inferredAlbum}」`
              : "影集名称，例如 2026"
          }
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

function FolderCover({ items }: { items: Photo[] }) {
  const covers = items.slice(0, 4);
  if (!covers.length) {
    return <div className="aspect-[4/3] bg-[color-mix(in_srgb,var(--fg)_6%,var(--bg))]" />;
  }
  if (covers.length === 1) {
    return (
      <img
        src={covers[0].url}
        alt=""
        className="aspect-[4/3] w-full object-cover"
      />
    );
  }
  return (
    <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-px bg-[var(--line)]">
      {covers.map((photo) => (
        <img
          key={photo.id}
          src={photo.url}
          alt=""
          className="h-full w-full object-cover"
        />
      ))}
    </div>
  );
}
