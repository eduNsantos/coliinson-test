export async function getLocation(locationName: string) {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetLocation($input: GetLocationInput!) {
          location(input: $input) {
            city
            country
            latitude
            longitude
          }
        }
      `,
      variables: { input: { locationName } },
    }),
  })

  if (!response.ok) throw new Error(`Falha na consulta. Status ${response.status}.`)
  return response
}
