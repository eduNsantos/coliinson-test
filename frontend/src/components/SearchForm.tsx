import type { ComponentProps } from 'react'
import type { Location } from '../types/ranking'

type Props = {
  search: string
  isLoading: boolean
  isLoadingSuggestions: boolean
  suggestions: Location[]
  onChange: (value: string) => void
  onSubmit: ComponentProps<'form'>['onSubmit']
  onSelectSuggestion: (location: Location) => void
}

export function SearchForm({
  search,
  isLoading,
  isLoadingSuggestions,
  suggestions,
  onChange,
  onSubmit,
  onSelectSuggestion,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="search"
        className="block mb-2 text-sm font-semibold text-slate-700"
      >
        Cidade, Estado ou Pais
      </label>
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <input
            id="search"
            name="search"
            type="text"
            value={search}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ex.: Santos, SP"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />

          {isLoadingSuggestions && (
            <p className="absolute left-4 top-full mt-1 text-xs text-slate-400">
              Buscando cidades...
            </p>
          )}

          {!isLoadingSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 top-full mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              {suggestions.map((loc) => (
                <li key={`${loc.city}-${loc.country}`}>
                  <button
                    type="button"
                    onClick={() => onSelectSuggestion(loc)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    {loc.city}, {loc.country}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? 'Buscando...' : 'Buscar ranking'}
        </button>
      </div>
    </form>
  )
}
