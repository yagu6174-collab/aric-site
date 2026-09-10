"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Photo } from "@/types/photo";

export default function AdminPhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/photography", { cache: "no-store" });
    setPhotos(await res.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("album", album);
    form.append("caption", caption);
    const res = await fetch("/api/photography", { method: "POST", body: form });
    setMessage(res.ok ? "已上传" : "上传失败，请先登录");
    if (res.ok) {
      setAlbum("");
      setCaption("");
      setFile(null);
      await load();
    }
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <Button onClick={upload}>上传照片</Button>
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
