import type { RankingByDay } from '../types/ranking'

const activityLabel: Record<string, string> = {
  surf: '🏄 Surf',
  outdoor: '🌿 Outdoor',
  ski: '⛷️ Ski',
  indoor: '🏠 Indoor',
}

type Props = {
  item: RankingByDay
}

export function RankingCard({ item }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-slate-700">{item.date}</h2>
      <ul className="flex flex-col gap-2">
        {item.ranking.map((rank, index) => (
          <li
            key={`${item.date}-${rank.activity}`}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                #{index + 1}
              </span>
              <span className="text-sm text-slate-700">
                {activityLabel[rank.activity] ?? rank.activity}
              </span>
            </div>
            <strong className="text-sm font-semibold text-blue-600">
              {rank.score.toFixed(2)}
            </strong>
          </li>
        ))}
      </ul>
    </article>
  )
}
