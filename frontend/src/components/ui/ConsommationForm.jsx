import { useState, useEffect } from 'react'
import { Modal, FormField, Spinner, Alert } from '../ui'
import { consommationApi } from '../../services/api'
import { todayISO } from '../../utils/helpers'

const APPAREILS = [
  'Chauffage','Éclairage','Cuisine','Réfrigérateur',
  'Lave-linge','Lave-vaisselle','Télévision','Ordinateur',
  'Climatisation','Chauffe-eau','Autre',
]
const EMPTY = { date_mesure: todayISO(), kwh: '', appareil: '', commentaire: '' }

export default function ConsommationForm({ open, onClose, onSaved, initial }) {
  const [form,   setForm]   = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)
  const [errs,   setErrs]   = useState({})
  const isEdit = !!initial?.id

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { date_mesure: initial.date_mesure ?? todayISO(), kwh: initial.kwh ?? '', appareil: initial.appareil ?? '', commentaire: initial.commentaire ?? '' }
        : EMPTY)
      setError(null); setErrs({})
    }
  }, [open, initial])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrs(e => ({ ...e, [k]: null })) }

  function validate() {
    const e = {}
    if (!form.date_mesure) e.date_mesure = 'Date requise'
    if (!form.kwh || isNaN(form.kwh) || parseFloat(form.kwh) <= 0) e.kwh = 'Valeur kWh invalide'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrs(v); return }
    setSaving(true); setError(null)
    try {
      const payload = {
        date_mesure: form.date_mesure,
        kwh:         parseFloat(form.kwh),
        appareil:    form.appareil    || null,
        commentaire: form.commentaire || null,
      }
      isEdit ? await consommationApi.update(initial.id, payload) : await consommationApi.create(payload)
      onSaved(); onClose()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Modifier la saisie' : 'Nouvelle saisie'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" error={errs.date_mesure} required>
            <input type="date" className="field-input" max={todayISO()}
                   value={form.date_mesure} onChange={e => set('date_mesure', e.target.value)} />
          </FormField>
          <FormField label="Consommation (kWh)" error={errs.kwh} required>
            <input type="number" step="0.01" min="0" max="9999" className="field-input"
                   placeholder="ex : 12.50"
                   value={form.kwh} onChange={e => set('kwh', e.target.value)} />
          </FormField>
        </div>

        <FormField label="Appareil" hint="Optionnel">
          <select className="field-input" value={form.appareil} onChange={e => set('appareil', e.target.value)}>
            <option value="">— Sélectionner —</option>
            {APPAREILS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </FormField>

        <FormField label="Commentaire" hint="Optionnel">
          <textarea className="field-input resize-none" rows={2}
                    placeholder="Notes, contexte…"
                    value={form.commentaire} onChange={e => set('commentaire', e.target.value)} />
        </FormField>

        <div className="flex gap-3 pt-1">
          <button type="button" className="btn-ghost flex-1" onClick={onClose} disabled={saving}>Annuler</button>
          <button type="submit" className="btn-primary flex-1" disabled={saving}>
            {saving && <Spinner size={14} className="text-white" />}
            {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
