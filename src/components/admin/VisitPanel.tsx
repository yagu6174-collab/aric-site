import type { VisitSummary } from "@/lib/visit-math";

const stats = [
  ["今日", "today"],
  ["近7日", "last7"],
  ["累计", "total"],
] as const;

export function VisitPanel({ visits }: { visits: VisitSummary }) {
  return (
    <section
      aria-label="访问量"
      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-[0_4px_14px_rgba(28,25,23,0.04)] sm:px-3.5"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h2 className="shrink-0 text-sm font-semibold leading-none tracking-tight text-stone-950">访问量</h2>
          <p className="min-w-[12rem] flex-1 text-[11px] leading-snug text-stone-500">
            公开首页每打开一次计一次。这是统计，不是页面上的字。
          </p>
        </div>
        <dl className="grid shrink-0 grid-cols-3 gap-1.5">
          {stats.map(([label, key]) => (
            <div key={key} className="flex items-baseline gap-1.5 rounded-lg bg-stone-50 px-2 py-1">
              <dt className="text-[11px] font-medium text-stone-500">{label}</dt>
              <dd className="text-sm font-semibold tabular-nums leading-none text-stone-950">
                {visits[key].toLocaleString("zh-Hans")}
              </dd>
            </div>
          ))}
        </dl>
        <ol className="grid shrink-0 grid-cols-7 gap-1 lg:w-80">
          {visits.days.map((day) => (
            <li
              key={day.date}
              title={day.date}
              aria-current={day.today ? "date" : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-md px-0.5 py-1 text-center leading-none tabular-nums ${day.today ? "bg-indigo-600 font-semibold text-white" : "bg-stone-50 text-stone-600 ring-1 ring-stone-200"}`}
            >
              <span className="text-[10px]">{day.label}</span>
              <span className="text-[11px] font-semibold">{day.count.toLocaleString("zh-Hans")}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
