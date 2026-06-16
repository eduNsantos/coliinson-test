import type { ComponentProps } from 'react'

type Props = {
  search: string
  isLoading: boolean
  onChange: (value: string) => void
  onSubmit: ComponentProps<'form'>['onSubmit']
}

export function SearchForm({ search, isLoading, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="search"
        className="block mb-2 text-sm font-semibold text-slate-700"
      >
        Cidade, Estado ou Pais
      </label>
      <div className="flex gap-3">
        <input
          id="search"
          name="search"
          type="text"
          value={search}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex.: Santos, SP"
          autoComplete="off"
          required
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        />
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
