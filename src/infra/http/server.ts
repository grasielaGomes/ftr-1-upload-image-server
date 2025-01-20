import { env } from '@/env'
import fastifyCors from '@fastify/cors'
import Fastify from 'fastify'

const server = Fastify()

server.register(fastifyCors, {
  origin: '*',
})

console.log(env.DATABASE_URL)

server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`HTTP server running at ${address}`)
})
