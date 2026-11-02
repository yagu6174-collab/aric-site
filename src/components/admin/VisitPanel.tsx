import type { VisitSummary } from "@/lib/visit-math";

const stats = [
  ["今日", "today"],
  ["近7日", "last7"],
  ["累计", "total"],
] as const;

export function VisitPanel({ visits }: { visits: VisitSummary }) {
  return (
    <section aria-label="访问量" className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_8px_24px_rgba(28,25,23,0.04)] sm:p-5">
      <h2 className="text-base font-semibold">访问量</h2>
      <p className="mt-1 text-xs leading-relaxed text-stone-500">公开首页每打开一次计一次。这是统计，不是页面上的字。</p>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {stats.map(([label, key]) => (
          <div key={key} className="rounded-xl bg-stone-50 px-3 py-2.5">
            <dt className="text-xs font-medium text-stone-500">{label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums leading-none">{visits[key].toLocaleString("zh-Hans")}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-4 grid grid-cols-7 gap-1.5">
        {visits.days.map((day) => (
          <li
            key={day.date}
            aria-current={day.today ? "date" : undefined}
            className={`rounded-xl px-1 py-1.5 text-center text-[11px] leading-tight tabular-nums ${day.today ? "bg-indigo-600 font-semibold text-white" : "bg-stone-50 text-stone-600 ring-1 ring-stone-200"}`}
          >
            <span className="block">{day.label}</span>
            <span className="mt-0.5 block text-sm font-semibold">{day.count.toLocaleString("zh-Hans")}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
