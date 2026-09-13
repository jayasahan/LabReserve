const API_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'labreserve_token'

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Unable to complete the equipment request')
  return data
}

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchEquipment({ search = '', category = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category && category !== 'All') params.set('category', category)
  const query = params.toString()
  const response = await fetch(`${API_URL}/equipment${query ? `?${query}` : ''}`, {
    headers: authHeaders()
  })
  const data = await readResponse(response)
  return data.equipment
}

export async function fetchEquipmentById(id) {
  const response = await fetch(`${API_URL}/equipment/${id}`, { headers: authHeaders() })
  const data = await readResponse(response)
  return data.equipment
}

export async function createEquipment(equipment) {
  const response = await fetch(`${API_URL}/equipment`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(equipment)
  })
  const data = await readResponse(response)
  return data.equipment
}

export async function updateEquipment(id, equipment) {
  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(equipment)
  })
  const data = await readResponse(response)
  return data.equipment
}

export async function deleteEquipment(id) {
  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return readResponse(response)
}
