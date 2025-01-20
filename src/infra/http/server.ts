import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'

const server = Fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`HTTP server running at ${address}`)
})
