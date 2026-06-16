import { useEffect, useRef, useState } from 'react'
import { SearchForm } from './components/SearchForm'
import { RankingCard } from './components/RankingCard'
import type { RankingByDay } from './types/ranking'
import { getRanking } from './services/ranking.service'

function App() {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<RankingByDay[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchRanking = async (term: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getRanking(term)
      const payload = (await response.json()) as {
        data?: { ranking?: RankingByDay[] }
        errors?: Array<{ message?: string }>
      }

      if (payload.errors && payload.errors.length > 0) {
        setResults([])
        setError(payload.errors[0].message ?? 'Erro ao consultar o ranking.')
        return
      }

      setResults(payload.data?.ranking ?? [])
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

  useEffect(() => {
    const term = search.trim()

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (term.length < 3) {
      setResults([])
      setError(null)
      return
    }

    debounceRef.current = setTimeout(() => fetchRanking(term), 1000)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  const handleSubmit = (event: { preventDefault(): void }) => {
    event.preventDefault()

    const term = search.trim()
    if (!term) {
      setError('Informe uma cidade, estado ou pais para pesquisar.')
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    fetchRanking(term)
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
