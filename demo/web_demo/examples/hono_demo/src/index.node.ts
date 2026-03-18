import app from '@/app'
import { serve } from '@hono/node-server'

app.get('/', (c) => c.text('Hello Node.js!'))
import type { Server as HttpServer } from 'node:http'
import  { Socket } from 'node:net'
const socket = new Socket()
// socket.server
serve(app)