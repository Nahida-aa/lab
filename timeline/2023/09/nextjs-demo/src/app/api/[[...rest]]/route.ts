import { RPCHandler, } from '@orpc/server/fetch'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { onError } from '@orpc/server'
import { router } from '@/modules/app'
import { RequestHeadersPlugin, StrictGetMethodPlugin } from '@orpc/server/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { SmartCoercionPlugin } from '@orpc/json-schema'

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError(error => {
      console.error('orpc:', error)
    }),
  ],
  plugins: [new StrictGetMethodPlugin(), new RequestHeadersPlugin(), new SmartCoercionPlugin({
    schemaConverters: [
      new ZodToJsonSchemaConverter(),
      // Add other schema converters as needed
    ],
  }), new OpenAPIReferencePlugin({
    // docsProvider: 'swagger', // default: 'scalar' or 'swagger'
    schemaConverters: [
      new ZodToJsonSchemaConverter(),
    ],
    specGenerateOptions: {
      info: {
        title: 'ORPC Playground',
        version: '1.0.0',
      },
      // servers: [ // or let the plugin auto-infer from the request
      //   { url: 'https://api.example.com/v1', },
      // ],
    },
  }),]
})


async function handleRequest(req: Request) {
  const { response } = await handler.handle(req, {
    prefix: '/api',
    context: {}, // Provide initial context if needed
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
