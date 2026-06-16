export async function getLocation(location: string) {
  const response = await fetch('/location', {
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
                search: location,
            },
            },
        }),
    })

    if (!response.ok) {
        throw new Error(`Falha na consulta. Status ${response.status}.`)
    }


    return response;
}