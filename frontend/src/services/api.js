const BASE = import.meta.env.VITE_API_URL || '/api'

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json
}

export const consommationApi = {
  getAll:  ()       => req('GET',    '/consommations'),
  getOne:  (id)     => req('GET',    `/consommations/${id}`),
  create:  (data)   => req('POST',   '/consommations', data),
  update:  (id, d)  => req('PUT',    `/consommations/${id}`, d),
  delete:  (id)     => req('DELETE', `/consommations/${id}`),
}

export const statsApi = {
  totalKwh:    () => req('GET', '/stats/total-kwh'),
  moyenneKwh:  () => req('GET', '/stats/moyenne-kwh'),
  parAppareil: () => req('GET', '/stats/par-appareil'),
}
