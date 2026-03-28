import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type ActivityScore = {
  activity: string
  score: number
}

type RankingByDay = {
  date: string
  ranking: ActivityScore[]
}

type RankingError = {
  error: string
  details?: string
}

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
    <main className="ranking-page">
      <section className="card">
        <h1>Ranking de Atividades</h1>
        <p>Consulte sugestoes de atividades com base na previsao do tempo.</p>

        <form onSubmit={handleSubmit} className="search-form">
          <label htmlFor="search">Cidade, Estado ou Pais</label>
          <div className="search-group">
            <input
              id="search"
              name="search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: Santos, SP"
              autoComplete="off"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Buscar ranking'}
            </button>
          </div>
        </form>

        {error ? <p className="feedback error">{error}</p> : null}

        {!error && results.length > 0 ? (
          <div className="results">
            {results.map((item) => (
              <article key={item.date} className="result-card">
                <h2>{item.date}</h2>
                <ul>
                  {item.ranking.map((rank) => (
                    <li key={`${item.date}-${rank.activity}`}>
                      <span>{rank.activity}</span>
                      <strong>{rank.score.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : null}

        {!error && !isLoading && results.length === 0 ? (
          <p className="feedback">Nenhum resultado ainda. Faça uma busca.</p>
        ) : null}
      </section>
    </main>
  )
}

export default App
