"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Photo } from "@/types/photo";

async function readError(res: Response) {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || "上传失败";
  } catch {
    return "上传失败";
  }
}

export default function AdminPhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/photography", { cache: "no-store" });
    setPhotos(await res.json());
  }

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = (await res.json()) as { authed?: boolean };
      if (!data.authed) {
        router.replace("/admin");
        return;
      }
      await load();
    })();
  }, [router]);

  async function upload() {
    if (!file) {
      setMessage("请先点击「选择照片」选一张图。");
      return;
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setMessage("照片超过 4MB，请压缩后再上传。");
      return;
    }
    setBusy(true);
    setMessage("正在上传…");
    const form = new FormData();
    form.append("file", file);
    form.append("album", album);
    form.append("caption", caption);
    const res = await fetch("/api/photography", { method: "POST", body: form });
    setBusy(false);
    if (!res.ok) {
      setMessage(await readError(res));
      return;
    }
    setMessage("已上传，可到前台「摄影自留地」查看。");
    setAlbum("");
    setCaption("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
    await load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/photography?id=${id}`, { method: "DELETE" });
    if (res.ok) await load();
    else setMessage("删除失败，请先登录");
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="font-serif text-2xl">上传照片</h1>
        <p className="text-sm text-[var(--muted)]">
          影集名称会成为前台的分组标题，例如「2026」或「宁波」。
        </p>
        <input
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="影集名称"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="光影旁白"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setMessage("");
            }}
          />
          <Button variant="ghost" onClick={() => inputRef.current?.click()}>
            选择照片
          </Button>
          <p className="text-sm text-[var(--muted)]">
            {file ? file.name : "还没有选择文件"}
          </p>
        </div>
        <Button onClick={upload} disabled={busy}>
          {busy ? "上传中…" : "上传照片"}
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </Card>
      <div className="grid gap-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif">{photo.album}</p>
              <p className="text-sm text-[var(--muted)]">{photo.caption}</p>
            </div>
            <Button variant="ghost" onClick={() => remove(photo.id)}>
              删除
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
