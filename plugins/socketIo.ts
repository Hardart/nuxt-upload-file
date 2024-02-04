import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
  if (!process.client) return

  const url = `http://127.0.0.1:`

  if (!url || typeof url !== 'string') return

  return {
    provide: {
      ws: (token: string | null, port: string) => io(url + port, { auth: { token } }),
    },
  }
})
