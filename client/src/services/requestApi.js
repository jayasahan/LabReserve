const API_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'labreserve_token'

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Unable to complete the request')
  return data
}

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createRequest(equipmentId) {
  const response = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipmentId })
  })
  const data = await readResponse(response)
  return data.request
}

export async function fetchMyRequests() {
  const response = await fetch(`${API_URL}/requests/my`, { headers: authHeaders() })
  const data = await readResponse(response)
  return data.requests
}

export async function cancelRequest(requestId) {
  const response = await fetch(`${API_URL}/requests/${requestId}/cancel`, {
    method: 'PATCH',
    headers: authHeaders()
  })
  const data = await readResponse(response)
  return data.request
}

export async function fetchAllRequests() {
  const response = await fetch(`${API_URL}/requests`, { headers: authHeaders() })
  const data = await readResponse(response)
  return data.requests
}

async function updateRequest(requestId, action) {
  const response = await fetch(`${API_URL}/requests/${requestId}/${action}`, {
    method: 'PATCH',
    headers: authHeaders()
  })
  const data = await readResponse(response)
  return data.request
}

export const approveRequest = (requestId) => updateRequest(requestId, 'approve')
export const rejectRequest = (requestId) => updateRequest(requestId, 'reject')
export const returnRequest = (requestId) => updateRequest(requestId, 'return')
