import { useState } from 'react'
import type { FormEvent } from 'react'
import { SearchForm } from './components/SearchForm'
import { RankingCard } from './components/RankingCard'
import type { RankingByDay, RankingError } from './types/ranking'

function App() {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<RankingByDay[]>([])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const term = search.trim()

    if (!term) {
      setError('Informe uma cidade, estado ou pais para pesquisar.')
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/ranking?search=${encodeURIComponent(term)}`)

      if (!response.ok) {
        throw new Error(`Falha na consulta. Status ${response.status}.`)
      }

      const data = (await response.json()) as RankingByDay[] | RankingError

      if (Array.isArray(data)) {
        setResults(data)
      } else {
        setResults([])
        setError(data.details ?? data.error)
      }
    } catch (requestError) {
      setResults([])
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Nao foi possivel consultar o ranking agora.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          Ranking de Atividades
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Consulte sugestoes de atividades com base na previsao do tempo.
        </p>

        <SearchForm
          search={search}
          isLoading={isLoading}
          onChange={setSearch}
          onSubmit={handleSubmit}
        />

        {error ? (
          <p className="mt-5 text-sm font-semibold text-red-600">{error}</p>
        ) : null}

        {!error && results.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <RankingCard key={item.date} item={item} />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && results.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-400">
            Nenhum resultado ainda. Faca uma busca.
          </p>
        ) : null}
      </section>
    </main>
  )
}

export default App
