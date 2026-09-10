import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between text-sm">
          <Link href="/admin" className="font-serif text-xl">
            管理后台
          </Link>
          <Link href="/" className="text-[var(--muted)]">
            返回前台
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
