// Example usage of the Eris HTTP client

import { createClient, BearerAuthorization } from './eris'

// Set up your authorization token
BearerAuthorization.get = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// Create an elegant API client (only builder has interceptors)
const api = createClient({
  baseURL: 'https://api.example.com',
  maxRetries: 3
})
  .useAuthorization(BearerAuthorization)
  .intercept('onRequest', (ctx) => {
    console.log(`Making ${ctx.init.method} request to:`, ctx.url)
  })
  .intercept('onResponse', (ctx) => {
    console.log(`Response status:`, ctx.response?.status)
  })
  .build()

// New elegant chainable API:

// Type-safe JSON parsing
interface User {
  id: number
  name: string
  email: string
}

// Chain .json() for automatic JSON parsing with types
const users = await api.get('/users', {
  params: {
    page: 1,
    limit: 10,
    filter: 'active'
  }
}).json<User[]>()

// Chain .text() for text content
const readme = await api.get('/readme.txt').text()

// Chain .response() to get the raw Response object
const statusResponse = await api.get('/health').response()
console.log('Status:', statusResponse.status)

// POST with automatic JSON serialization and typed response
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
}).json<User>()

// PUT with headers and blob response
const avatarBlob = await api.put('/users/123/avatar', formData, {
  headers: { 'X-Upload-Source': 'profile' }
}).blob()

// DELETE with just the response status check
const deleteResponse = await api.delete('/users/123').response()
if (deleteResponse.ok) {
  console.log('User deleted successfully')
}

export { api }
