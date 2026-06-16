export async function getRanking(search: string) {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
            query GetRanking($input: GetRankingInput!) {
                ranking(input: $input) {
                date
                ranking {
                    activity
                    score
                }
                }
            }
            `,
            variables: {
            input: {
                search: search,
            },
            },
        }),
    })

    if (!response.ok) {
    throw new Error(`Falha na consulta. Status ${response.status}.`)
    }


    return response;
}