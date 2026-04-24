/**
 * Service API — aligné exactement sur les routes backend PHP :
 *
 *  POST   /consommations
 *  GET    /consommations
 *  GET    /consommations/:id
 *  PUT    /consommations/:id
 *  DELETE /consommations/:id
 *  GET    /stats/total-kwh
 *  GET    /stats/moyenne-kwh
 *  GET    /stats/par-appareil
 */

const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  const text = await res.text()
  const json = text ? JSON.parse(text) : null

  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json
}

const get  = (p)    => request('GET',    p)
const post = (p, b) => request('POST',   p, b)
const put  = (p, b) => request('PUT',    p, b)
const del  = (p)    => request('DELETE', p)

// ── Consommations ────────────────────────────────────────────────────────
export const consommationApi = {
  /** Retourne un tableau : [{id, date_mesure, kwh, appareil, commentaire, created_at}] */
  getAll:   ()       => get('/consommations'),
  getOne:   (id)     => get(`/consommations/${id}`),
  /** body: { date_mesure, kwh, appareil?, commentaire? } */
  create:   (data)   => post('/consommations', data),
  update:   (id, d)  => put(`/consommations/${id}`, d),
  delete:   (id)     => del(`/consommations/${id}`),
}

// ── Statistiques ─────────────────────────────────────────────────────────
export const statsApi = {
  /** { total_kwh: "70.75" } */
  totalKwh:   () => get('/stats/total-kwh'),
  /** { moyenne_kwh: "14.15" } */
  moyenneKwh: () => get('/stats/moyenne-kwh'),
  /** [{ appareil: "Chauffage", total_kwh: "46.05" }, …] */
  parAppareil: () => get('/stats/par-appareil'),
}

export default { consommationApi, statsApi }
